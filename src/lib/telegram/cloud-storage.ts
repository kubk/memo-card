import WebApp from "@twa-dev/sdk";
import { type StorageController } from "mobx-persist-store";

// An adapter of the Telegram cloud storage to the mobx-persist-store interface
export const cloudStorageAdapter: StorageController = {
  getItem(key: string) {
    return new Promise((resolve, reject) => {
      WebApp.CloudStorage.getItem(key, (err, value) => {
        if (err != null) {
          return reject(err);
        } else {
          // @ts-ignore
          return resolve(value);
        }
      });
    });
  },
  removeItem(key: string) {
    return new Promise((resolve, reject) => {
      WebApp.CloudStorage.removeItem(key, (err, result) => {
        if (err != null) {
          return reject(err);
        } else {
          // @ts-ignore
          return resolve(result);
        }
      });
    });
  },
  setItem(key: string, value: any) {
    return new Promise((resolve, reject) => {
      WebApp.CloudStorage.setItem(key, value, (err, result) => {
        if (err != null) {
          return reject(err);
        } else {
          // @ts-ignore
          return resolve(result);
        }
      });
    });
  },
};
