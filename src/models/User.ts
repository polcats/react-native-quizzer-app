import { createContext } from 'react';
import { AsyncStorage } from 'react-native';

import {
  model,
  Model,
  modelAction,
  modelFlow,
  prop,
  registerRootStore,
  _async,
  _await,
} from 'mobx-keystone';
import { observable } from 'mobx';

type UserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
};

@model('expenseTracker/User')
class User extends Model({
  loggedIn: prop<boolean>(false),
}) {
  token = '';
  user: UserData = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    token: '',
  };
  storageKey = 'userData';
  @observable loading = true;
  @observable failure = {
    showErr: false,
    badEmail: false,
    badPw: false,
  };

  constructor(data: any) {
    super(data);
    this.loadData();
  }

  @modelAction
  setFailure = (showErr: boolean, isBadEmail: boolean, isBadPw: boolean) => {
    this.failure.showErr = showErr;
    this.failure.badEmail = isBadEmail;
    this.failure.badPw = isBadPw;
  };

  @modelFlow
  loadData = _async(function* (this: User) {
    try {
      const data = yield* _await(AsyncStorage.getItem(this.storageKey));
      const items = data ?? undefined;
      if (items) {
        // check first if tok is not expired
        this.loggedIn = true;
        this.token = data as string;
      }
    } catch (error) {
    } finally {
      this.loading = false;
    }
  });

  @modelFlow
  storeData = _async(function* (this: User) {
    try {
      const data = JSON.stringify(this.token);
      _await(AsyncStorage.setItem(this.storageKey, data));
    } catch (e) {}
  });

  @modelFlow
  removeData = _async(function* (this: User) {
    try {
      _await(AsyncStorage.removeItem(this.storageKey));
    } catch (e) {}
  });

  @modelAction
  updateToken = (tok: string) => {
    this.token = tok;
    this.storeData();
  };

  @modelFlow
  logIn = _async(function* (this: User, email: string, pw: string) {
    // authenticate user ...
    // on success:
    this.token = 'new-dummy-token';
    this.loggedIn = true;
    this.storeData();
    return true;

    // on fail:
    this.failure.showErr = true;
    this.failure.badEmail = true; // if email is not found..
    this.failure.badPw = true; // if pw is wrong
    // or
    //this.setFailure(true, true, true)
    // return false
  });

  @modelFlow
  signUp = _async(function* (
    this: User,
    fn: string,
    ln: string,
    email: string,
    pw: string,
  ) {
    // check if acc creation is succ
    // this.token = 'new-dummy-token';
    // this.loggedIn = true;
    // this.storeData();
    // return true;

    // else
    return false;
  });

  @modelFlow
  logOut = _async(function* (this: User) {
    // send req to server...
    // once OK:
    this.token = '';
    this.loggedIn = false;
    this.removeData();
  });
}

const createUserStore = (): User => {
  const store = new User({});
  registerRootStore(store);

  return store;
};

const userContext = createContext(createUserStore());
export default userContext;
