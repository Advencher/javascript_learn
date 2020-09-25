export class Api {  
  
  url = "https://5f57b3c71a07d600167e730a.mockapi.io/scientia/";

  constructor(endpoint){
    this.endpoint = endpoint;
  }

  async get() {
      const response = await fetch(`${this.url}${this.endpoint}`);
      const data = await response.json();
      return data;
  }

  async setToStorage(dataBaseName) {
    if(!localStorage.getItem(dataBaseName)) {
      const dataBase = await this.get();
      localStorage.setItem(dataBaseName, JSON.stringify(dataBase))
    }
  }
};