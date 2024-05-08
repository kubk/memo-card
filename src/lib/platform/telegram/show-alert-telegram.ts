import WebApp from "@twa-dev/sdk";

export const showAlertTelegram = (text: string) => {
  WebApp.showAlert(text);
};
