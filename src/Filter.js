import { Catalog } from './Catalog.js';

export class Filter {
  constructor(booksData) {
    this.books = booksData; 
    this.resetCatalog = new Catalog('books');
    this.openListenerFunc = this.openFilterForm.bind(this);
    this.closeListenerFunc = this.closeFilterForm.bind(this);
    this.filterFunc = this.filterBooks.bind(this);
    this.rangeFunc = this.changeBooksAmountSelected.bind(this);
    this.resetFunc = this.resetCatalogAndForm.bind(this);
  }

  set books(booksData) {
    this._books = JSON.parse(localStorage.getItem(booksData));
  }

  get books() {
    return this._books;
  }

  //filling filter with data on the website

  fillFilter() {
    this.fillCheckBoxSection(this.findAllPropertiesValues('author'), '.filter__authors-list');
    this.fillCheckBoxSection(this.findAllPropertiesValues('genre'), '.filter__genres-list');
    this.setMinAndMaxBooksAmounts();
  }

  findAllPropertiesValues(property) {
    const propertySet = new Set();
    for(const book of this.books) {
      propertySet.add(book[property]);
    }
    const sortedPropertyArray = Array.from(propertySet).sort();
    return sortedPropertyArray;
  }

  setMinAndMaxBooksAmounts() {
    const booksAmounts = this.findAllPropertiesValues('totalAmount');
    const minAmount = Math.min(...booksAmounts);
    const maxAmount = Math.max(...booksAmounts);
    const rangeBooksAmount = document.querySelector('.filter__amount');
    rangeBooksAmount.setAttribute('min', minAmount);
    rangeBooksAmount.setAttribute('max', maxAmount);
    rangeBooksAmount.defaultValue = minAmount;
    const amountDefault = document.querySelector('.filter__current-amount');
    amountDefault.innerText = minAmount;
  }

  fillCheckBoxSection(fillingOptions, ulClass) {
    const optionsUl = document.querySelector(ulClass);
    for(const option of fillingOptions) {      
      optionsUl.append(this.createOneOptionTile(option));
    }
  }

  createOneOptionTile(option) {
    const optionLi = document.createElement('li');
    optionLi.setAttribute('class', 'filter__author');
    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('id', option);
    optionLi.append(checkBox);
    const label = document.createElement('label');
    label.setAttribute('for', option);
    label.innerText = option;
    optionLi.append(label);
    return optionLi;
  }

  //toggle icons for opening the form

  invokeOpenIconListener() {
    const openIcon = document.querySelector('.filter__open-icon');
    openIcon.addEventListener('click', this.openListenerFunc);
  }

  destroyOpenIconListener() {
    const openIcon = document.querySelector('.filter__open-icon');
    openIcon.removeEventListener('click', this.openListenerFunc);
  }

  openFilterForm() {
    const filterForm = document.querySelector('.filter__form');
    filterForm.classList.remove('hidden');
    const closeIcon = document.querySelector('.filter__close-icon');
    closeIcon.classList.remove('hidden');
    const openIcon = document.querySelector('.filter__open-icon');
    openIcon.classList.add('hidden');
    this.destroyOpenIconListener();
    this.invokeCloseIconListener();
    this.invokeApplyButtonListener();
    this.invokeRangeListener();
    this.invokeClearListener();
  }
  
  invokeCloseIconListener() {
    const closeIcon = document.querySelector('.filter__close-icon');
    closeIcon.addEventListener('click', this.closeListenerFunc);
  }

  destroyCloseIconListener() {
    const closeIcon = document.querySelector('.filter__close-icon');
    closeIcon.removeEventListener('click', this.closeListenerFunc);
  }

  closeFilterForm() {
    const filterForm = document.querySelector('.filter__form');
    filterForm.classList.add('hidden');
    const closeIcon = document.querySelector('.filter__close-icon');
    closeIcon.classList.add('hidden');
    const openIcon = document.querySelector('.filter__open-icon');
    openIcon.classList.remove('hidden');
    this.destroyCloseIconListener();
    this.destroyApplyButtonListener();
    this.destroyRangeListener();
    this.destroyClearListener();
    this.invokeOpenIconListener();
  }

  invokeRangeListener() {
    const rangeBooksAmount = document.querySelector('.filter__amount');
    rangeBooksAmount.addEventListener('input', this.rangeFunc);
  }

  destroyRangeListener() {
    const rangeBooksAmount = document.querySelector('.filter__amount');
    rangeBooksAmount.removeEventListener('input', this.rangeFunc);
  }

  changeBooksAmountSelected() {
    const amountChosen = document.querySelector('.filter__current-amount');
    const rangeBooksAmount = document.querySelector('.filter__amount');
    amountChosen.innerText = rangeBooksAmount.value;
    if(rangeBooksAmount.value === rangeBooksAmount.getAttribute('max')) {
      amountChosen.nextSibling.setAttribute('class', 'hidden');
    } else {
      amountChosen.nextSibling.classList.remove('hidden');
    }
  }

  //filtering proccess

  invokeApplyButtonListener() {
    const buttonApply = document.querySelector('.filter__apply-button');
    buttonApply.addEventListener('click', this.filterFunc);
  }

  destroyApplyButtonListener() {
    const buttonApply = document.querySelector('.filter__apply-button');
    buttonApply.removeEventListener('click', this.filterFunc);
  }

  filterBooks() {
    const notfilteredBooks = [...this.books];
    const booksFilteredByAuthor = this.filterByOptions(notfilteredBooks, '.filter__authors-list input', 'author');
    const booksFilteredByGenre = this.filterByOptions(booksFilteredByAuthor, '.filter__genres-list input', 'genre');
    const filteredBooks = this.filterByAmount(booksFilteredByGenre);
    localStorage.setItem('filteredBooks', JSON.stringify(filteredBooks));
    this.displayFilteredBooks();
  }

  filterByOptions(booksToFilter, selector, optionProperty) {
    const allOptions = document.querySelectorAll(selector);
    const selectedOptions = [];
    for(const option of allOptions) {
      if(option.checked) {
        selectedOptions.push(option.getAttribute('id'));
      }
    }
    if(selectedOptions.length !== 0) {
      booksToFilter = booksToFilter.filter((book) => selectedOptions.find((option) => option === book[optionProperty]));
    }
    return booksToFilter;
  }

  filterByAmount(booksToFilter) {
    const rangeAmount = document.querySelector('.filter__amount');
    const minAmount = rangeAmount.value;
    const maxAmount = rangeAmount.getAttribute('max');
    return booksToFilter.filter((book) => book.currentAmount >= minAmount && book.currentAmount <= maxAmount);
  }

  displayFilteredBooks() {    
    this.filteredCatalog = new Catalog('filteredBooks');
    this.filteredCatalog.clearCatalog();
    this.filteredCatalog.displayAllBooks();
  }

  //clearing the form

  invokeClearListener() {
    const clearButton = document.querySelector('.filter__clear-button');
    clearButton.addEventListener('click', this.resetFunc);
  }

  destroyClearListener() {
    const clearButton = document.querySelector('.filter__clear-button');
    clearButton.removeEventListener('click', this.resetFunc);
  }

  resetCatalogAndForm() {
    this.filteredCatalog.clearCatalog();
    this.resetCatalog.clearCatalog();
    this.resetCatalog.displayAllBooks();
    const rangeBooksAmount = document.querySelector('.filter__amount');
    const amountDefault = document.querySelector('.filter__current-amount');
    amountDefault.innerText = rangeBooksAmount.defaultValue;
  } 
}