import { ShowConfirmType } from "../platform.ts";
import { getWebApp } from "./telegram-web-app.ts";

export const showConfirmTelegram: ShowConfirmType = (text) => {
  return new Promise((resolve) => {
    getWebApp().showConfirm(text, (confirmed) => {
      resolve(confirmed);
    });
  });
};
