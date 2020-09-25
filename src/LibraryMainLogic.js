import { BorrowJournal } from "./BorrowJournal.js";
import { QueueController } from "./QueueController.js";

export class LibraryMainLogic {
  allBookQueues = [];
  constructor(bookRepository, userRepository) {
    if (LibraryMainLogic._instance) {
      throw new Error("Класс уже инициализирован");
    }
    LibraryMainLogic._instance = this;
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
   
    if (localStorage.getItem('Queues')) this.allBookQueues = JSON.parse(localStorage.getItem("Queues"));
    else
    this.InitAllQueues();

    
    this.libraryJournal = new BorrowJournal(
      this.bookRepository,
      this.userRepository
    );
    this.libraryJournal.syncJournal();
    this.checkForTimeReturns();
    
  }


  checkForTimeReturns() {
    let currentDate = new Date();
    let entries = this.libraryJournal.allEntries();
    entries.forEach((entry, key) => {
      if (entry.date < currentDate) {
      
        this.userReturningBook(entry.userId, entry.bookId);
      }
    });
  }

  checkQuantity(userId) {
    for (let [idx, user] of this.userRepository.users.entries()) {
      if (user.id === userId) {
        if (this.userRepository.users[idx].books.length < 25) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  
  resolveEntryToJournal(bookId, userId, date, quantity) {
    for (let book of this.bookRepository.books) {
      if (bookId === book.id) {
        if (book.totalAmount > 0) {
          if (this.checkQuantity(userId) === false) {
            return "too__many";
          }
          let index = this.bookRepository.books.indexOf(book);
          if (this.bookRepository.books[index].totalAmount - quantity < 0)
            return "over_capacity";
          this.bookRepository.books[index].totalAmount -= quantity;
          this.libraryJournal.addEntryJournal(book.id, userId, date, quantity);

          for (let [idx, user] of this.userRepository.users.entries()) {
            if (user.id === userId) {
              for (let i = 0; i < quantity; i++) {
                this.userRepository.users[idx].books.push(bookId);
              }
              break;
            }
          }
          this.syncBooksUsers();
          break;
        } else if (book.totalAmount === 0) {
          for (let [idx, queue] of this.allBookQueues.entries()) {
            if (queue.bookId === book.id) {
              let tmp = new QueueController(userId);
              tmp.queue = this.allBookQueues[idx].queue;
              tmp.amountForReserve = this.allBookQueues[idx].amountForReserve;
              tmp.addToQueue(userId, quantity);
              this.allBookQueues[idx].queue = tmp.queue;
              this.allBookQueues[idx].amountForReserve = tmp.amountForReserve;
              this.syncQueues();
              return 'queue';
              break;
            }
          }
          break;
        }
      }
    }
   
    
  }

  userReturningBook(userId, bookId) {
   
    for (let [idx1, book] of this.bookRepository.books.entries()) {
      if (book.id === bookId) {
        for (let [idx2, queue] of this.allBookQueues.entries()) {
          if (queue.bookId === book.id) {
            if (queue.queue.length > 0) {
              let amount = this.libraryJournal.removeEntryJournal(
                userId,
                bookId
              );
              let tmp = new QueueController(bookId);
              tmp.queue = this.allBookQueues[idx2].queue;
              tmp.amountForReserve = this.allBookQueues[idx2].amountForReserve;
              tmp.fromQueueToJournal(this, amount);
              this.allBookQueues[idx2].queue = tmp.queue;
              this.allBookQueues[idx2].amountForReserve = tmp.amountForReserve;
              for (let [idx, user] of this.userRepository.users.entries()) {
                if (user.id === userId) {
                  this.userRepository.users[idx].books.splice(
                    this.userRepository.users[idx].books.indexOf(bookId),
                    amount
                  );
                  break;
                }
              }
              this.syncQueues();
              this.syncBooksUsers();
              break;
            } else {
              let amountReturned = this.libraryJournal.removeEntryJournal(
                userId,
                bookId
              );
              this.bookRepository.books[idx1].totalAmount += amountReturned;
              for (let [idx, user] of this.userRepository.users.entries()) {
                if (user.id === userId) {
                  this.userRepository.users[idx].books.splice(
                    this.userRepository.users[idx].books.indexOf(bookId),
                    amountReturned
                  );
                  break;
                }
              }
              this.syncBooksUsers();
              break;
            }
          }
        }
        break;
      }
    }
  }

  userCancelQueueEntry(userId, bookId) {
    for (let [idx, queue] of this.allBookQueues.entries()) {
      if (queue.bookId === bookId) {
        let tmp = new QueueController(userId);
        tmp.queue = this.allBookQueues[idx].queue;
        tmp.amountForReserve = this.allBookQueues[idx].amountForReserve;
        tmp.userWilledToRemoveHimself(userId);
        this.allBookQueues[idx].queue = tmp.queue;
        this.allBookQueues[idx].amountForReserve = tmp.amountForReserve;
        break;
      }
    }
    this.syncQueues();
  }

  //создаем все очереди
  InitAllQueues() {
    this.bookRepository.books.forEach((book) => {
      this.allBookQueues.push(new QueueController(book.id));
    });
    localStorage.setItem("Queues", JSON.stringify(this.allBookQueues));
  }

  syncQueues() {
    localStorage.setItem("Queues", JSON.stringify(this.allBookQueues));
    this.allBookQueues = JSON.parse(localStorage.getItem("Queues")); 
  }

  syncBooksUsers() {

    localStorage.setItem("books", JSON.stringify(this.bookRepository.books));
    this.bookRepository.books = JSON.parse(localStorage.getItem("books"));

    localStorage.setItem("users", JSON.stringify(this.userRepository.users));
    this.userRepository.users = JSON.parse(localStorage.getItem("users"));

  }
  
  getReservations(bookId) {
    let controller = new QueueController(bookId);
    for (let [idx, queue] of this.allBookQueues.entries()) {
      if (queue.bookId === bookId) {
        controller.queue = queue.queue;
        controller.amountForReserve = queue.amountForReserve;
        break;
      }
    }
    return controller.getInfoQueueForBook(this.userRepository.users);
  }
}


