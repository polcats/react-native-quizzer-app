import { createContext } from 'react';
import { AsyncStorage } from 'react-native';
import api from '../services';
import { decode } from 'base-64';

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
      const validData = data ?? undefined;
      if (validData) {
        const userData = JSON.parse(validData);

        // Check if token is expired
        const payload = JSON.parse(decode(userData.token.split('.')[1]));
        const expiry = new Date(payload.exp * 1000).getTime();
        const currentTime = new Date().getTime();
        if (currentTime >= expiry) {
          _await(AsyncStorage.removeItem(this.storageKey));
          return;
        }

        // Reauth
        const apiWithHeader = api.extend({
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });
        const res: any = yield* _await(apiWithHeader.post('auth/reauth'));

        if (res.ok) {
          this.loggedIn = true;
          this.user = userData as UserData;
        }
      }
    } catch (error) {
      _await(AsyncStorage.removeItem(this.storageKey));
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
      return true;
    } catch (error) {
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
