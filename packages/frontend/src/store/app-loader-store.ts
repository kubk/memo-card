import { makeAutoObservable } from "mobx";

class AppLoaderStore {
  isAppLoading = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  enable() {
    this.isAppLoading = true;
  }

  disable() {
    this.isAppLoading = false;
  }
}

export const appLoaderStore = new AppLoaderStore();
