import { t } from "../../translations/t.ts";
import { DeckLanguage } from "./store/deck-catalog-store.ts";

export const languageFilterToNativeName = (str: DeckLanguage): string => {
  switch (str) {
    case DeckLanguage.Any:
      return t("any_language");
    case DeckLanguage.English:
      return "English";
    case DeckLanguage.Russian:
      return "Русский";
    case DeckLanguage.Spanish:
      return "Español";
    default:
      return str satisfies never;
  }
};
