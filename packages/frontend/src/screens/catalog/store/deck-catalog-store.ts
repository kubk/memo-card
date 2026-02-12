import { makeAutoObservable } from "mobx";
import { TextField } from "mobx-form-lite";
import { persistableField } from "../../../lib/mobx-form-lite-persistable/persistable-field.ts";
import { CatalogItem } from "api";
import { LanguageCatalogItemAvailableIn } from "api";
import { createCachedCategoriesRequest } from "../../../api/create-cached-categories-request.ts";
import { api } from "../../../api/trpc-api.ts";
import { InfiniteRequestStore } from "../../../lib/mobx-request/infinite-request-store.ts";

export type DeckLanguage = "any" | LanguageCatalogItemAvailableIn;

type Cursor = {
  createdAt: string;
};

export class DeckCatalogStore {
  // We don't use RequestStore caching here, because we want incremental pagination.
  private catalogRequest = new InfiniteRequestStore<
    CatalogItem,
    Cursor,
    { filters: { availableIn?: DeckLanguage; categoryId?: string } }
  >(api.catalog.list.query, {
    pageSize: 15,
    getFilters: () => ({
      filters: this.apiFilters,
    }),
    getItemKey: (item) => `${item.type}:${item.data.id}`,
  });
  categoriesRequest = createCachedCategoriesRequest();

  filters = {
    language: persistableField(
      new TextField<DeckLanguage>("any", {
        afterChange: () => this.catalogRequest.reload(),
      }),
      "catalogLn",
    ),
    categoryId: new TextField("", {
      afterChange: () => this.catalogRequest.reload(),
    }),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get apiFilters() {
    return {
      availableIn:
        this.filters.language.value === "any"
          ? undefined
          : this.filters.language.value,
      categoryId: this.filters.categoryId.value || undefined,
    };
  }

  async load() {
    this.categoriesRequest.execute();
    await this.catalogRequest.reload();
  }

  get catalogItems(): CatalogItem[] {
    return this.catalogRequest.items;
  }

  get isInitialLoading() {
    return this.catalogRequest.isInitialLoading;
  }

  get isLoadingMore() {
    return this.catalogRequest.isLoadingMore;
  }

  get hasCatalogLoaded() {
    return this.catalogRequest.hasLoaded;
  }

  loadMore() {
    return this.catalogRequest.loadMore();
  }
}
