import { Catalog } from './Catalog.js';

export class Search {
  constructor() {
    this.books = JSON.parse(localStorage.getItem('books'));
    this.searchFunc = this.searchBooks.bind(this);
  }

  invokeSearchFormListener() {
    const searchForm = document.querySelector('.search__form');
    searchForm.addEventListener('submit', this.searchFunc);
  }

  searchBooks(event) {
    event.preventDefault();
    const input = document.querySelector('.search__input');
    const searchRequest = input.value.trim().toLowerCase();
    const matchesInTitles = this.findMatchingBooks(searchRequest, 'title');
    const matchesInAuthors = this.findMatchingBooks(searchRequest, 'author');
    const matchedBooks = [...new Set([...matchesInTitles, ...matchesInAuthors])];
    localStorage.setItem('foundBooks', JSON.stringify(matchedBooks));
    this.showMatchedBooks();
  }

  findMatchingBooks(request, option) {
    const matched = [];
    for(const book of this.books) {
      const BOOK_OPTION_CLEARED = (book[option]).toLowerCase().split(' ').join('');
      if(BOOK_OPTION_CLEARED.indexOf(request) >= 0) {
        matched.push(book);
      }
    }
    return matched;
  }

  showMatchedBooks() {
    const foundBooksCatalog = new Catalog('foundBooks');
    foundBooksCatalog.clearCatalog();
    foundBooksCatalog.displayAllBooks();
  }
}