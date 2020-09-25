import { Modal } from './Modal.js';

export class Authorization {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('users'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loginfunc = this.initAuthorization.bind(this);
    this.logoutfunc = this.logOutUser.bind(this);
    this.removefunc = this.removeWarning.bind(this);
    this.authorizefunc = this.authorizeUser.bind(this);
  }

  //main function

  checkIfUserIsAuthorized() {
    if(this.currentUser) {
      this.createLogOut();
      this.changeLogInAfterAuthorisation();
    } else {
      this.invokeLogInListeners();
    }
  }

  //log in form & button listeners

  invokeLogInListeners() {
    const logInButton = document.getElementById('open-modal');    
    logInButton.addEventListener('click', this.loginfunc);
  }

  destroyLogInListeners() {
    const logInButton = document.getElementById('open-modal');    
    logInButton.removeEventListener('click', this.loginfunc);
  }
  
  initAuthorization(event) {
    const AUTHORIZATION_FORM = `
      <form method="get" class="login" id="login">
        <input id="logName" class="login-input" type="text" placeholder="Insert Name">
        <input id="logPass" class="login-input" type="text" placeholder="Insert Password">
        <button type="submit" class="login-button" id="login-button-js">Log In</button>
        <button type="button" class="login-button login-button__close" id="close-modal">Exit</button>
      </form>`;
    this.authorizationModal = new Modal(AUTHORIZATION_FORM, document.getElementById('modal'));
    this.authorizationModal.create();
    this.invokeCloseButtonListener();
    this.invokeLoginFormListener();
  }
  
  invokeCloseButtonListener() {
    const closeButton = document.getElementById('close-modal');
    this.modalfunc = this.authorizationModal.destroy.bind(this.authorizationModal);
    closeButton.addEventListener('click', this.modalfunc);
  }

  destroyCloseButtonListener() {
    const closeButton = document.getElementById('close-modal');
    closeButton.removeEventListener('click', this.modalfunc);
  }

  invokeLoginFormListener() {
    const loginForm = document.getElementById('login');
    loginForm.addEventListener('submit', this.authorizefunc);
  }

  destroyLoginFormListener() {
    const loginForm = document.getElementById('login');
    loginForm.removeEventListener('submit', this.authorizefunc);
  }

  //authorization

  authorizeUser(event) {
    const user = this.identifyUser();
    if(!!user) {      
      this.destroyInputsListeners();
      localStorage.setItem('currentUser', JSON.stringify(user));      
      this.createLogOut();      
      this.authorizationModal.destroy();
      this.changeLogInAfterAuthorisation();
    } else {
      event.preventDefault();
      this.showValidationWarning();
    }
  }

  identifyUser() {
    const userName = document.getElementById('logName').value;
    const userPassword = document.getElementById('logPass').value;
    return this.users.find((user) => {
      return user.login === userName && user.password === userPassword;
    });
  }

  showValidationWarning() {
    const currentMessage = document.querySelector('.login__message');
    if(!currentMessage) {
      const nameInput = document.getElementById('logName');
      nameInput.style.border = '1px solid #f44336';
      const passwordInput = document.getElementById('logPass');
      passwordInput.style.border = '1px solid #f44336';
      const message = document.createElement('span');
      message.setAttribute('class', 'login__message');
      message.innerText = 'Wrong username or password.';
      passwordInput.after(message);
      this.invokeInputsListeners();
    }
  }

  invokeInputsListeners() {
    const inputs = document.querySelectorAll('#login > input');
    for(const input of inputs) {
      input.addEventListener('click', this.removefunc);
    }
  }

  destroyInputsListeners() {
    const inputs = document.querySelectorAll('#login > input');
    for(const input of inputs) {
      input.removeEventListener('click', this.removefunc);
    }
  }

  removeWarning(event) {
    const nameInput = document.getElementById('logName');
    nameInput.style.border = 'none';
    const passwordInput = document.getElementById('logPass');
    passwordInput.style.border = 'none';
    const message = document.querySelector('.login__message');
    message.remove();    
  }

  //"after logging in" changes

  changeLogInAfterAuthorisation() {
    const myAccount = document.getElementById('open-modal');
    myAccount.childNodes[1].setAttribute('href', 'account.html');
    this.destroyLogInListeners();
    this.destroyCloseButtonListener();
    this.destroyLoginFormListener();
  }

  createLogOut() {
    const myAccount = document.getElementById('open-modal');
    const logOutButton = myAccount.cloneNode(true);
    logOutButton.setAttribute('id', 'logout-button');    
    logOutButton.setAttribute('class', 'top-menu__logout');
    logOutButton.childNodes[1].innerText = 'Log Out';
    myAccount.after(logOutButton);
    this.invokeLogOutListener();
  }

  //log out process

  invokeLogOutListener() {
    const logOutButton = document.getElementById('logout-button');
    logOutButton.addEventListener('click', this.logoutfunc);
  }

  destroyLogOutListener() {
    const logOutButton = document.getElementById('logout-button');
    logOutButton.removeEventListener('click', this.logoutfunc);
  }

  logOutUser(event) {
    localStorage.removeItem('currentUser');
    this.destroyLogOutListener();
    const logOutButton = document.querySelector('#logout-button');
    logOutButton.remove();
    this.changeLogInAfterLogout();
    location.pathname = '/index.html';
  }

  changeLogInAfterLogout() {
    const myAccount = document.getElementById('open-modal');
    myAccount.childNodes[1].setAttribute('href', '');
    this.invokeLogInListeners();
  }
};