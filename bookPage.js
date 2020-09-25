
import { Authorization } from './src/Authorization.js';
import { BookPageController} from './src/BookPageController.js';

import { LibraryMainLogic } from './src/LibraryMainLogic.js';
import { BookRepository, UserRepository } from "./src/BookRepository.js";




class BookPage {
  constructor() {

  }

  startPageScript() {

    //const bookPage = new BookPageController(library);
    //bookPage.displayRequestedBook();

    this.libraryController = new LibraryMainLogic(new BookRepository(), new UserRepository());
    const bookController = new BookPageController(this.libraryController);
    bookController.displayRequestedBook();
    
    const authorization = new Authorization();
    authorization.checkIfUserIsAuthorized();
  }
}

const bookPage = new BookPage();
bookPage.startPageScript();