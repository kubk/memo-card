import { makeAutoObservable } from "mobx";
import { catalogGetRequest, deckCategoriesRequest } from "../../../api/api.ts";
import {
  fromPromise,
  IPromiseBasedObservable,
} from "../../../lib/mobx-from-promise/from-promise.ts";
import { TextField } from "mobx-form-lite";
import { cachePromise } from "../../../lib/cache/cache-promise.ts";
import { DeckCategoryResponse } from "../../../../functions/deck-categories.ts";
import { persistableField } from "../../../lib/mobx-form-lite-persistable/persistable-field.ts";
import {
  CatalogItem,
  DeckCatalogResponse,
} from "../../../../functions/catalog.ts";

export enum DeckLanguage {
  Any = "any",
  English = "en",
  Spanish = "es",
  Russian = "ru",
}

const catalogCached = cachePromise<DeckCatalogResponse>();
const categoriesCached = cachePromise<DeckCategoryResponse>();

export class DeckCatalogStore {
  catalog?: IPromiseBasedObservable<DeckCatalogResponse>;
  filters = {
    language: persistableField(new TextField(DeckLanguage.Any), "catalogLn"),
    categoryId: new TextField(""),
  };
  categories?: IPromiseBasedObservable<DeckCategoryResponse>;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.catalog = fromPromise(catalogCached(catalogGetRequest()));
    this.categories = fromPromise(categoriesCached(deckCategoriesRequest()));
  }

  get filteredCatalogItems(): CatalogItem[] {
    if (this.catalog?.state !== "fulfilled") {
      return [];
    }

    const language = this.filters.language.value;
    const categoryId = this.filters.categoryId.value;

    return this.catalog.value.filter((catalogItem) => {
      const item = catalogItem.data;
      if (language !== DeckLanguage.Any && item.available_in !== language) {
        return false;
      }

      if (!!categoryId && item.category_id !== categoryId) {
        return false;
      }

      return true;
    });
  }
}
