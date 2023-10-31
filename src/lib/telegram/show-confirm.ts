import WebApp from "@twa-dev/sdk";

export const showConfirm = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    WebApp.showConfirm(text, (confirmed) => {
      resolve(confirmed);
    });
  });
};
