
export class QueueController {
  queue = [];
  amountForReserve = [];
  constructor(bookId) {
    this.bookId = bookId;
  }

  addToQueue(userId, quantity) {
    this.queue.push(userId);
    this.amountForReserve.push(quantity);
  }

  userWilledToRemoveHimself(userId) {
    let idx = this.queue.indexOf(userId);
    this.queue.splice(idx, 1);
    this.amountForReserve.splice(idx, 1);
  }

  fromQueueToJournal(logic, amount) {
    while (amount !== 0 || this.queue.length !== 0) {
      for (let i = 0; i < this.queue.length; i++) {
        let userId = this.queue[i];
        if (!logic.checkQuantity(userId)) {
          continue;
        }
        while (
          logic.checkQuantity(userId) &&
          this.amountForReserve[this.queue.indexOf(userId)] !== 0 &&
          amount !== 0
        ) {
          logic.journalObject.addEntryJournal(this.bookId, userId);
          amount--;
          this.amountForReserve[this.queue.indexOf(userId)]--;
          for (let [idx, user] of logic.userRepository.users.entries()) {
            if (userId === user.id) {
              logic.userRepository.users[idx].books.push(this.bookId);
              break;
            }
          }
          if (this.amountForReserve[this.queue.indexOf(userId)] === 0) {
            this.queue.userWilledToRemoveHimsel(userId);
          }
        }
      }
    }
    return false;
  }

  getInfoQueueForBook(users) {
    let entries = [];
    for (let [idx, user] of users.entries()) {
      for (let [idx, userInQueueId] of this.queue.entries()) {
        if (user.id === userInQueueId) {
          let idx = this.queue.indexOf(userInQueueId);
          let entry = {
            userObj: user,
            amount: this.amountForReserve[idx],
          };
          entries.push(entry);
        }
      }
    }
    return entries;
  }
}
