import { t } from "../../translations/t.ts";
import { DeckLanguage } from "./store/deck-catalog-store.ts";
import { languageCatalogItemAvailableInToNative } from "../../../shared/language/language-shared.ts";

export const languageFilterToNativeName = (str: DeckLanguage): string => {
  if (str === "any") {
    return t("any_language");
  }
  return languageCatalogItemAvailableInToNative(str);
};
