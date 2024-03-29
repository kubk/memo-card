import { makeAutoObservable } from "mobx";
import { deckCatalogRequest, deckCategoriesRequest } from "../../../api/api.ts";
import {
  fromPromise,
  IPromiseBasedObservable,
} from "../../../lib/mobx-from-promise/from-promise.ts";
import { DeckCatalogResponse } from "../../../../functions/catalog-decks.ts";
import { TextField } from "mobx-form-lite";
import { cachePromise } from "../../../lib/cache/cache-promise.ts";
import { DeckCategoryResponse } from "../../../../functions/deck-categories.ts";
import { t } from "../../../translations/t.ts";
import { persistableField } from "../../../lib/mobx-form-lite-persistable/persistable-field.ts";

export enum DeckLanguage {
  Any = "any",
  English = "en",
  Spanish = "es",
  Russian = "ru",
}

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

const decksCached = cachePromise<DeckCatalogResponse>();
const categoriesCached = cachePromise<DeckCategoryResponse>();

export class DeckCatalogStore {
  decks?: IPromiseBasedObservable<DeckCatalogResponse>;
  filters = {
    language: persistableField(new TextField(DeckLanguage.Any), "catalogLn"),
    categoryId: new TextField(""),
  };
  categories?: IPromiseBasedObservable<DeckCategoryResponse>;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.decks = fromPromise(decksCached(deckCatalogRequest()));
    this.categories = fromPromise(categoriesCached(deckCategoriesRequest()));
  }

  get filteredDecks() {
    if (this.decks?.state !== "fulfilled") {
      return [];
    }

    const language = this.filters.language.value;
    const categoryId = this.filters.categoryId.value;

    return this.decks.value.decks.filter((deck) => {
      if (language !== DeckLanguage.Any && deck.available_in !== language) {
        return false;
      }

      if (!!categoryId && deck.category_id !== categoryId) {
        return false;
      }

      return true;
    });
  }
}
