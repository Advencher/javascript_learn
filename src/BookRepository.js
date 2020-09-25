export class BookRepository {
  endpoint = "books";
  books = [];
  constructor() {
    this.getBooks();
  }
  get allBooks() {
    return this.books;
  }
  async getBooks() {
    this.books = JSON.parse(localStorage.getItem("books"));
    return true;
  }
}

export class UserRepository {
  endpoint = "users";
  users = [];
  constructor() {
    this.getUsers();
  }
  async getUsers() {
    this.users = JSON.parse(localStorage.getItem("users"));
    return true;
  }
  get allUsers() {
    return this.users;
  }
}
