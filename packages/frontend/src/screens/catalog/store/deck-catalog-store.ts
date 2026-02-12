import { makeAutoObservable } from "mobx";
import { CatalogItem } from "api";
import { LanguageCatalogItemAvailableIn } from "api";
import { createCachedCategoriesRequest } from "../../../api/create-cached-categories-request.ts";
import { api } from "../../../api/trpc-api.ts";
import { InfiniteRequestStore } from "../../../lib/mobx-request/infinite-request-store.ts";
import { screenStore } from "../../../store/screen-store.ts";

export type DeckLanguage = "any" | LanguageCatalogItemAvailableIn;

type Cursor = {
  createdAt: string;
};

export class DeckCatalogStore {
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

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  private get route() {
    const screen = screenStore.screen;
    if (screen.type !== "deckCatalog") {
      return { type: "deckCatalog" as const };
    }
    return screen;
  }

  get language(): DeckLanguage {
    return (this.route.availableIn as DeckLanguage) || "any";
  }

  get categoryId(): string {
    return this.route.categoryId || "";
  }

  setLanguage(value: DeckLanguage) {
    screenStore.replace({
      ...this.route,
      availableIn: value === "any" ? undefined : value,
    });
    this.catalogRequest.reload();
  }

  setCategoryId(value: string) {
    screenStore.replace({
      ...this.route,
      categoryId: value || undefined,
    });
    this.catalogRequest.reload();
  }

  private get apiFilters() {
    return {
      availableIn: this.language === "any" ? undefined : this.language,
      categoryId: this.categoryId || undefined,
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
