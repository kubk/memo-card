import WebApp from "@twa-dev/sdk";

export const getCloudValue = (key: string): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.getItem(key, (err, value) => {
      if (err != null) {
        return reject(err);
      } else {
        return resolve(value);
      }
    });
  });
};

export const setCloudValue = (key: string, value: string) => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.setItem(key, value, (err, result) => {
      if (err != null) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};
