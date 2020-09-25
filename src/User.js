export class User {
  constructor(login, password, email) {
    this.login = login;
    this.password = password;
    this.email = email;
  }
  id = Math.floor(Math.random() * 1011101);
  books = [];
  borrowBook(bookId) {
    this.books.push(bookId);
  }
  returnBook(bookId) {
    const BOOK_INDEX = this.books.indexOf(bookId);
    this.books.splice(BOOK_INDEX, 1);
  }
}
