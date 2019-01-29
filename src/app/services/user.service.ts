import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private angularFireDatabaseModule: AngularFireDatabase) {
  }

  getUsers() {
    return this.angularFireDatabaseModule.list('/users');
  }

  getUserById(uid: any) {
    return this.angularFireDatabaseModule.object(`/users/${uid}`);
  }

  createUser(user: User) {
    return this.angularFireDatabaseModule.object(`/users/${user.uid}`).set(user);
  }

  editUser(user: User) {
    return this.angularFireDatabaseModule.object(`/users/${user.uid}`).set(user);
  }

  setAvatar(avatar, uid) {
    return this.angularFireDatabaseModule.object(`/users/${uid}/avatar`).set(avatar);
  }

}
