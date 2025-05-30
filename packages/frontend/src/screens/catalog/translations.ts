import { t } from "../../translations/t.ts";
import { DeckLanguage } from "./store/deck-catalog-store.ts";
import { languageCatalogItemAvailableInToNative } from "api";

export const languageFilterToNativeName = (str: DeckLanguage): string => {
  if (str === "any") {
    return t("any_language");
  }
  return languageCatalogItemAvailableInToNative(str);
};
