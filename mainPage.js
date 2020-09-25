import { Catalog } from './src/Catalog.js';
import { Api } from './src/Api.js';
import { Authorization } from './src/Authorization.js';
import { Filter } from './src/Filter.js';
import { Search } from './src/Search.js';

class MainPage {
  

  constructor() {

  }

  async startPageScript() {
    const usersApi = new Api('users');
    await usersApi.setToStorage('users');
  
    const booksApi = new Api('books');
    await booksApi.setToStorage('books');
  
   

    const catalog = new Catalog('books');
    catalog.displayAllBooks();
  
    const authorization = new Authorization();
    authorization.checkIfUserIsAuthorized();

    const filter = new Filter('books');
    filter.fillFilter();
    filter.invokeOpenIconListener();

    const search = new Search();
    search.invokeSearchFormListener();

   

  }
}


const mainPage = new MainPage();
mainPage.startPageScript();
export const libraryController = mainPage.libraryController;