export class BookPageUI {
  constructor() {
    this.book = JSON.parse(localStorage.getItem('currentBook'));
  }

  displayRequestedBook() {
    const bookCover = document.querySelector('.book-description__cover');
    bookCover.setAttribute('src', this.book.image);
    const bookTitle = document.querySelector('.book-description__title');
    bookTitle.innerText = this.book.title;
    const bookAuthor = document.querySelector('.book-description__author');
    bookAuthor.innerText = this.book.author;
    const bookYear = document.querySelector('.book-description__year');
    bookYear.innerText = this.book.year;
    const bookAnnotation = document.querySelector('.book-description__annotation');
    bookAnnotation.innerText = this.book.description;
  }
}