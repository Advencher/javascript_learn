

export class Catalog {
  constructor(booksData) {
    this.books = booksData;
    this.booksType = booksData;
    this.openButtonFunc = this.openBookPage.bind(this);
    this.rightSwitchFunc = this.openNextCatalogPage.bind(this);
    this.leftSwitchFunc = this.openPreviousCatalogPage.bind(this);
  }

  set books(booksData) {
    this._books = JSON.parse(localStorage.getItem(booksData));
  }

  get books() {
    return this._books;
  }

  async displayAllBooks() {
    if(this.books.length === 0) {
      this.saySorryForEmptyCatalog();
    } else {
      const partedBooks = this.breakBooksIntoTens();
      for(const blockOfBooks of partedBooks) {
        this.displayTensOfBooks(blockOfBooks);
      }      
      const firstBlock = document.querySelector('.books-catalog__books-block');
      firstBlock.classList.remove('hidden');
      firstBlock.setAttribute('id', 'current-books-block');
      if(partedBooks.length === 1) {
        this.changeArrowColor('.catalog-pages__left', '#bdbdbd');        
        this.changeArrowColor('.catalog-pages__right', '#bdbdbd');
      } else {
        this.invokeRightArrowListener();
        this.changeArrowColor('.catalog-pages__left', '#bdbdbd');  
      }
      this.invokeButtonListeners();
    }
  }  

  breakBooksIntoTens() {
    const tensOfBooks = [];
    const currentBooks = [...this.books];
    if(currentBooks.length > 10) {
      let i = 0;
      for(i; i < currentBooks.length; i += 10) {
        tensOfBooks.push(currentBooks.splice(i, i + 10));
      }
      tensOfBooks.push(currentBooks);
    } else {
      tensOfBooks.push(currentBooks);
    }
    return tensOfBooks;
  }

  displayTensOfBooks(blockOfBooks) {
    const pageCatalog = document.querySelector('.books-catalog');
    const booksWrapper = document.createElement('div');
    booksWrapper.setAttribute('class', 'books-catalog__books-block hidden');
    for(const book of blockOfBooks) {
      if(!!book) {
        const bookTile = this.createBookTile(book);
        booksWrapper.append(bookTile);
      }
    }
    pageCatalog.append(booksWrapper);
  }

  createBookTile(book) {
    const bookTile = document.createElement('div');
    bookTile.setAttribute('class', 'books-catalog__book');
    const description = document.createElement('div');
    description.setAttribute('class', 'books-catalog__book-description');
    const cover = document.createElement('img');
    cover.setAttribute('src', book.image);    
    description.append(cover);
    const bookInfo = document.createElement('div');
    bookInfo.setAttribute('class', 'books-catalog__book-info');
    const title = document.createElement('p');
    title.innerText = book.title;
    const author = document.createElement('p');
    author.innerText = book.author;
    const annotation = document.createElement('p');
    annotation.setAttribute('class', 'books-catalog__annotation');
    annotation.innerText = this.transformAnnotation(book.description);
    bookInfo.append(title);
    bookInfo.append(author);
    bookInfo.append(annotation);
    description.append(bookInfo);
    bookTile.append(description);
    const reference = document.createElement('a');
    reference.setAttribute('href', 'bookView.html');
    reference.setAttribute('class', 'books-catalog__reference');
    reference.setAttribute('data-bookid', book.id);
    reference.innerText = 'Borrow';
    bookTile.append(reference);
    return bookTile;
  }

  transformAnnotation(annotation) {
    const annotationArr = annotation.split(' ');
    if(annotationArr.length > 30) {
      annotation = `${annotationArr.slice(0, 31).join(' ')}...`;
    }    
    return annotation;
  }

  saySorryForEmptyCatalog() {
    const booksCatalog = document.querySelector('.books-catalog');
    const sorryParagraph = document.createElement('p');
    sorryParagraph.setAttribute('class', 'books-catalog__excuses');
    sorryParagraph.innerText = 'Sorry, we found nothing.';
    booksCatalog.append(sorryParagraph);
  }

  invokeRightArrowListener() {
    const rightArrow = document.querySelector('.catalog-pages__right');
    this.changeArrowColor('.catalog-pages__right', '#8bc34a');
    rightArrow.addEventListener('click', this.rightSwitchFunc);
  }

  destroyRightArrowListener() {
    const rightArrow = document.querySelector('.catalog-pages__right');
    this.changeArrowColor('.catalog-pages__right', '#bdbdbd');
    rightArrow.removeEventListener('click', this.rightSwitchFunc);
  }

  openNextCatalogPage(event) {
    const currentBooksBlock = document.getElementById('current-books-block');
    const booksCatalog = document.querySelector('.books-catalog');
    const nextPage = currentBooksBlock.nextSibling;
    if(booksCatalog.childNodes[1] === nextPage) {
      this.invokeLeftArrowListener();
    }
    if(!!nextPage) {
      nextPage.setAttribute('id', 'current-books-block');
      nextPage.classList.remove('hidden');
      currentBooksBlock.classList.add('hidden');
      currentBooksBlock.removeAttribute('id');
    }
    if(booksCatalog.lastChild === nextPage) {
      this.destroyRightArrowListener();
    }
  }

  invokeLeftArrowListener() {
    const leftArrow = document.querySelector('.catalog-pages__left');
    this.changeArrowColor('.catalog-pages__left', '#8bc34a');
    leftArrow.addEventListener('click', this.leftSwitchFunc);
  }

  destroyLeftArrowListener() {
    const leftArrow = document.querySelector('.catalog-pages__left');    
    this.changeArrowColor('.catalog-pages__left', '#bdbdbd');
    leftArrow.removeEventListener('click', this.leftSwitchFunc);
  }

  openPreviousCatalogPage(event) {
    const currentBooksBlock = document.getElementById('current-books-block');
    const booksCatalog = document.querySelector('.books-catalog');
    const previousPage = currentBooksBlock.previousSibling;
    if(booksCatalog.childNodes[booksCatalog.childNodes.length - 2] === previousPage) {
      this.invokeRightArrowListener();
    }
    if(!!previousPage) {
      previousPage.setAttribute('id', 'current-books-block');
      previousPage.classList.remove('hidden');
      currentBooksBlock.classList.add('hidden');
      currentBooksBlock.removeAttribute('id');
    }
    if(booksCatalog.firstChild=== previousPage) {
      this.destroyLeftArrowListener();
    }
  }

  changeArrowColor(selector, color) {
    const arrow = document.querySelector(selector).childNodes[1];
    arrow.style.fill = color;
  }

  clearCatalog() {
    this.destroyButtonListeners();
    const pageCatalog = document.querySelector('.books-catalog');
    while(pageCatalog.firstChild) {
      pageCatalog.removeChild(pageCatalog.firstChild);
    }
    this.destroyLeftArrowListener();
    this.destroyRightArrowListener();
  }

  invokeButtonListeners() {
    const buttonReferences = document.querySelectorAll('.books-catalog__reference');
    buttonReferences.forEach((button) => {
      button.addEventListener('click', this.openButtonFunc);
    });
  }

  destroyButtonListeners() {
    const buttonReferences = document.querySelectorAll('.books-catalog__reference');
    buttonReferences.forEach((button) => {
      button.removeEventListener('click', this.openButtonFunc);
    });
  }

  openBookPage(event) {
    const book = event.currentTarget;
    const BOOK_ID = book.dataset.bookid;
    const currentBook = this.findBookById(BOOK_ID);
    
    console.log(currentBook);
    localStorage.setItem('currentBook', JSON.stringify(currentBook));
  }

  findBookById(id) {
    let result;
    for(const book of this.books) {
      if(book.id === id) {
        result = book;
        break;
      }
    }
    return result;
  }
}