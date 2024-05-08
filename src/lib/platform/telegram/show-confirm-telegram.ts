import WebApp from "@twa-dev/sdk";
import { ShowConfirmType } from "../platform.ts";

export const showConfirmTelegram: ShowConfirmType = (text) => {
  return new Promise((resolve) => {
    WebApp.showConfirm(text, (confirmed) => {
      resolve(confirmed);
    });
  });
};
