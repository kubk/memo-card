import { getWebApp } from "./telegram-web-app.ts";

export const showAlertTelegram = (text: string) => {
  getWebApp().showAlert(text);
};
