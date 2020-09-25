import { Util } from "./Util.js";

export class BorrowJournal {
  constructor(bookRepository, userRepository) {
    if (BorrowJournal._instance) {
      throw new Error("Класс уже инициализирован");
    }
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
    BorrowJournal._instance = this;
    this.journal = new Map();
    if (localStorage.getItem("Journal"))
      this.journal = new Map(JSON.parse(localStorage.getItem("Journal")));
    else this.syncJournal();
  }

  allEntries(sortMode = "name") {
    let entries_map = new Map();
    let BreakException = {};

    this.journal.forEach((mapObject, key) => {
      this.bookRepository.books.forEach((book) => {
        if (mapObject.bookId === book.id) {
          let userTmp;
          try {
            this.userRepository.users.forEach((user) => {
              if (mapObject.userId === user.id) {
                userTmp = user;
                throw BreakException;
              }
            });
          } catch (breaked) {
            entries_map.set(book, userTmp);
          }
        }
      });
    });

    return entries_map;
  }

  booksForUser(userId, sortMode = "title") {
    let entries = [];
    this.journal.forEach((mapObject, key) => {
      if (userId === mapObject.userId) {
        this.bookRepository.books.forEach((book) => {
          if (mapObject.bookId === book.id) {
            entries.push(book);
          }
        });
      }
    });
    entries = Util.customSort({ data: entries, sortField: sortMode });
    return entries;
  }

  usersForBook(bookId, sortMode = "login") {
    let entries = [];
    this.journal.forEach((mapObject, key) => {
      if (mapObject.bookId === bookId) {
        this.userRepository.users.forEach((user) => {
          if (mapObject.userId === user.id) {
            let obj = {
              user: user,
              date: mapObject.dateReturn,
              amount: mapObject.amount,
            };
            entries.push(obj);
          }
        });
      }
    });

    entries = Util.customSort({ data: entries, sortField: sortMode });
    return entries;
  }

  addEntryJournal(bookToAddId, userToAddId, date, quantity) {
    this.journal.set(Util.uuidv4(), {
      bookId: bookToAddId,
      userId: userToAddId,
      dateReturn: date,
      amount: quantity,
    });
    this.syncJournal();
    return true;
  }

  removeEntryJournal(userToRemoveId, bookToReturnId) {
    let amount;
    this.journal.forEach((mapObject, key) => {
      if (
        mapObject.bookId === bookToReturnId &&
        mapObject.userId === userToRemoveId
      ) {
        amount = mapObject.amount;
        this.journal.delete(key);
      }
    });
    this.syncJournal();
    return amount;
  }

  syncJournal() {
    localStorage.setItem(
      "Journal",
      JSON.stringify(Array.from(this.journal.entries()))
    );
    this.journal = new Map(JSON.parse(localStorage.getItem("Journal")));
  }
}
