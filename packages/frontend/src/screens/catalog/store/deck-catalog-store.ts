import { makeAutoObservable } from "mobx";
import { TextField } from "mobx-form-lite";
import { persistableField } from "../../../lib/mobx-form-lite-persistable/persistable-field.ts";
import { CatalogItem } from "api";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { LanguageCatalogItemAvailableIn } from "api";
import { createCachedCategoriesRequest } from "../../../api/create-cached-categories-request.ts";
import { api } from "../../../api/trpc-api.ts";

export type DeckLanguage = "any" | LanguageCatalogItemAvailableIn;

export class DeckCatalogStore {
  catalogRequest = new RequestStore(api.catalog.list.query, {
    cacheId: "catalogRequest",
  });
  categoriesRequest = createCachedCategoriesRequest();

  filters = {
    language: persistableField(new TextField<DeckLanguage>("any"), "catalogLn"),
    categoryId: new TextField(""),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.catalogRequest.execute();
    this.categoriesRequest.execute();
  }

  get filteredCatalogItems(): CatalogItem[] {
    if (this.catalogRequest.result.status !== "success") {
      return [];
    }

    const language = this.filters.language.value;
    const categoryId = this.filters.categoryId.value;

    return this.catalogRequest.result.data.filter((catalogItem) => {
      const item = catalogItem.data;
      if (language !== "any" && item.availableIn !== language) {
        return false;
      }

      // noinspection RedundantIfStatementJS
      if (!!categoryId && item.categoryId !== categoryId) {
        return false;
      }
      return true;
    });
  }
}
