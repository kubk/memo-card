import { makeAutoObservable } from "mobx";
import { LanguageCatalogItemAvailableIn } from "api";
import { api } from "../../../api/trpc-api.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { makeInfiniteQuery } from "../../../lib/mobx-query-lite/make-infinite-query.ts";

export type DeckLanguage = "any" | LanguageCatalogItemAvailableIn;

type CatalogFilters = {
  availableIn?: DeckLanguage;
  categoryId?: string;
};

const pageSize = 15;

export class DeckCatalogStore {
  catalogQuery = makeInfiniteQuery(() => {
    const filters = this.apiFilters;
    return {
      key: `catalog.list:${JSON.stringify(filters)}`,
      query: ({ cursor }) =>
        api.catalog.list.query({
          limit: pageSize,
          cursor,
          filters,
        }),
    };
  });
  categoriesQuery = makeQuery({
    key: "catalog.deckCategories",
    query: api.catalog.deckCategories.query,
  });

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
  }

  setCategoryId(value: string) {
    screenStore.replace({
      ...this.route,
      categoryId: value || undefined,
    });
  }

  private get apiFilters(): CatalogFilters {
    return {
      availableIn: this.language === "any" ? undefined : this.language,
      categoryId: this.categoryId || undefined,
    };
  }
}
