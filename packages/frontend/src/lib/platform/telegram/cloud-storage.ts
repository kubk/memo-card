import { type StorageController } from "mobx-persist-store";
import { getWebApp } from "./telegram-web-app.ts";

// Spent too much time on this bs:
// https://core.telegram.org/bots/webapps#cloudstorage:~:text=A%20method%20that%20receives%20values%20from%20the%20cloud%20storage%20using%20the%20specified%20keys.%20The%20keys%20should%20contain%201%2D128%20characters%2C%20only%20A%2DZ%2C%20a%2Dz%2C%200%2D9%2C%20_%20and%20%2D%20are%20allowed.
const isCloudStorageKeyValid = (key: string): boolean => {
  if (!key) {
    return false;
  }
  if (key.length < 1 || key.length > 128) {
    return false;
  }
  return /^[A-Za-z0-9_-]+$/.test(key);
};

function getStorage() {
  return getWebApp().isVersionAtLeast("9.0")
    ? getWebApp().CloudStorage
    : getWebApp().DeviceStorage;
}

// An adapter of the Telegram cloud storage to the mobx-persist-store interface
export const cloudStorageAdapter: StorageController = {
  getItem(key: string) {
    return new Promise((resolve, reject) => {
      if (!isCloudStorageKeyValid(key)) {
        return reject(new Error(`Cloud Storage invalid key: ${key}`));
      }
      getStorage().getItem(key, (err, value) => {
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
      getStorage().removeItem(key, (err, result) => {
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
      if (!isCloudStorageKeyValid(key)) {
        return reject(new Error(`Cloud Storage invalid key: ${key}`));
      }

      getStorage().setItem(key, value, (err, result) => {
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
