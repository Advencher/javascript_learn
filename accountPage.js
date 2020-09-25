import { Authorization } from './src/Authorization.js';
import { Search } from './src/Search.js';

class AccountPage {
  constructor() {

  }

  startPageScript() {
    const authorization = new Authorization();
    authorization.checkIfUserIsAuthorized();

    const search = new Search();
    search.invokeSearchFormListener();
  }
}

const accountPage = new AccountPage();
accountPage.startPageScript();