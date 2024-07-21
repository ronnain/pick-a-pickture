import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  // store the user name in the local storage
  storeUserName(name: string) {
    localStorage.setItem('userName', name);
  }

  // get the user name from the local storage
  getUserName() {
    return localStorage.getItem('userName');
  }

  isMainUser() {
    return this.getUserName() === 'Laura30ans';
  }
}
