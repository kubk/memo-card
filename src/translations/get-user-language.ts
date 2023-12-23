import { Language } from "./t.ts";

export const getUserLanguage = (): Language => {
  return "ru";
  // const languageCode = WebApp.initDataUnsafe.user?.language_code;
  // switch (languageCode) {
  //   case "ru":
  //     return "ru";
  //   default:
  //     return "en";
  // }
};
