import { Language } from "./t.ts";
import WebApp from "@twa-dev/sdk";

export const getUserLanguage = (): Language => {
  const languageCode = WebApp.initDataUnsafe.user?.language_code;
  switch (languageCode) {
    case "ru":
    case "es":
    case 'pt-br':
      return languageCode;
    default:
      return "en";
  }
};
