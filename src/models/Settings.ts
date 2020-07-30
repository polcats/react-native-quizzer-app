import { createContext } from 'react';
import { AsyncStorage } from 'react-native';
import {
  model,
  Model,
  modelFlow,
  prop,
  registerRootStore,
  _async,
  _await,
  modelAction,
} from 'mobx-keystone';
import { observable, computed } from 'mobx';
import * as eva from '@eva-design/eva';

@model('app/Settings')
class Settings extends Model({}) {
  storageKey = 'appSettings';
  @observable mode: string = 'light';
  @observable loading = true;

  constructor(data: any) {
    super(data);
    this.loadData();
  }

  @computed
  get isDark() {
    return this.mode === 'dark' ? true : false;
  }

  @computed
  get theme() {
    return this.mode === 'dark' ? eva.dark : eva.light;
  }

  @modelFlow
  loadData = _async(function* (this: Settings) {
    try {
      const data = yield* _await(AsyncStorage.getItem(this.storageKey));
      const items = data ?? undefined;
      if (items) {
        this.mode = JSON.parse(items);
      }
    } catch (error) {
    } finally {
      this.loading = false;
    }
  });

  @modelFlow
  storeData = _async(function* (this: Settings) {
    try {
      const data = JSON.stringify(this.mode);
      _await(AsyncStorage.setItem(this.storageKey, data));
    } catch (e) {}
  });

  @modelFlow
  setIsDark = _async(function* (this: Settings, mode: boolean) {
    this.mode = this.isDark ? 'light' : 'dark';
    _await(this.storeData());
  });
}

const createSettingsStore = (): Settings => {
  const store = new Settings({});
  registerRootStore(store);
  return store;
};

const settingsContext = createContext(createSettingsStore());
export default settingsContext;
