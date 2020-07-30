import { createContext } from 'react';
import { AsyncStorage } from 'react-native';
import api from '../services';

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
  email: string;
  firstName: string;
  lastName: string;
  token: string;
};

@model('app/User')
class User extends Model({
  loggedIn: prop<boolean>(false),
}) {
  token = '';
  user: UserData = {
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
        this.user = JSON.parse(items) as UserData;
        console.log(this.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  });

  @modelFlow
  storeData = _async(function* (this: User) {
    try {
      const data = JSON.stringify(this.user);
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
    const req = { email: email, password: pw };
    console.log('logging..');
    try {
      const res: any = yield* _await(
        api.post('auth/login', { json: req }).json(),
      );

      this.user.firstName = res.data.firstName;
      this.user.lastName = res.data.lastName;
      this.user.email = res.data.email;
      this.user.token = res.data.token;
      this.loggedIn = true;
      this.storeData();
      console.log(res);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });

  @modelFlow
  logOut = _async(function* (this: User) {
    try {
      const apiWithHeader = api.extend({
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });
      const res: any = yield* _await(apiWithHeader.post('auth/logout'));
      _await(AsyncStorage.removeItem(this.storageKey));
      this.loggedIn = false;
    } catch (error) {}
  });

  @modelFlow
  signUp = _async(function* (
    this: User,
    fn: string,
    ln: string,
    email: string,
    pw: string,
  ) {
    const req = {
      firstName: fn,
      lastName: ln,
      email: email,
      password: pw,
    };

    try {
      const res: any = yield* _await(
        api.post('auth/register', { json: req }).json(),
      );

      this.user.firstName = res.data.firstName;
      this.user.lastName = res.data.lastName;
      this.user.email = res.data.email;
      this.user.token = res.data.token;
      this.loggedIn = true;
      this.storeData();

      return true;
    } catch (error) {
      return false;
    }
  });
}

const createUserStore = (): User => {
  const store = new User({});
  registerRootStore(store);

  return store;
};

const userContext = createContext(createUserStore());
export default userContext;
