import { makeAutoObservable } from "mobx";
import { catalogGetRequest, deckCategoriesRequest } from "../../../api/api.ts";
import { TextField } from "mobx-form-lite";
import { persistableField } from "../../../lib/mobx-form-lite-persistable/persistable-field.ts";
import { CatalogItem } from "../../../../functions/catalog.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";

export enum DeckLanguage {
  Any = "any",
  English = "en",
  Spanish = "es",
  Russian = "ru",
}

export class DeckCatalogStore {
  catalogRequest = new RequestStore(catalogGetRequest, {
    cacheId: "catalogRequest",
  });
  categoriesRequest = new RequestStore(deckCategoriesRequest, {
    cacheId: "categoriesRequest",
  });

  filters = {
    language: persistableField(new TextField(DeckLanguage.Any), "catalogLn"),
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
