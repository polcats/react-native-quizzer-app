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
} from 'mobx-keystone';
import { observable } from 'mobx';
import * as eva from '@eva-design/eva';

@model('app/Settings')
class Settings extends Model({
  theme: prop<any>(eva.light),
}) {
  storageKey = 'userSettings';
  @observable loading = false;

  constructor(data: any) {
    super(data);
    this.loadData();
  }

  @modelFlow
  loadData = _async(function* (this: Settings) {
    try {
      const data = yield* _await(AsyncStorage.getItem(this.storageKey));
      const items = data ?? undefined;
      if (items) {
        this.theme = JSON.parse(items);
      }
    } catch (error) {
    } finally {
      this.loading = false;
    }
  });

  @modelFlow
  storeData = _async(function* (this: Settings) {
    try {
      const data = JSON.stringify(this.theme);
      _await(AsyncStorage.setItem(this.storageKey, data));
    } catch (e) {}
  });
}

const createSettingsStore = (): Settings => {
  const store = new Settings({});
  registerRootStore(store);

  return store;
};

const settingsContext = createContext(createSettingsStore());
export default settingsContext;
