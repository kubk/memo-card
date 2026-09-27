import { makeAutoObservable } from "mobx";
import { LanguageCatalogItemAvailableIn } from "api";
import { api, apiProxy } from "../../../api/trpc-api.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { makeInfiniteQuery } from "../../../lib/mobx-query-lite/make-infinite-query.ts";
import { enumValues } from "../../../lib/typescript/enum-values.ts";
import { t, translateCategory } from "../../../translations/t.ts";
import { languageFilterToNativeName } from "../translations.ts";

export type DeckLanguage = "any" | LanguageCatalogItemAvailableIn;

type CatalogFilter = "category" | "language";
type ActiveFilter = CatalogFilter | null;

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
  categoriesQuery = makeQuery(apiProxy.catalog.deckCategories.query);
  activeFilter: ActiveFilter = null;

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

  get categoryOptions() {
    return [
      { id: "", title: t("any_category") },
      ...(this.categoriesQuery.data?.categories ?? []).map((category) => ({
        id: category.id,
        title: translateCategory(category.name),
      })),
    ];
  }

  get languageOptions() {
    return (["any"] as DeckLanguage[])
      .concat(enumValues(LanguageCatalogItemAvailableIn) as DeckLanguage[])
      .map((key) => ({
        id: key,
        title: languageFilterToNativeName(key),
      }));
  }

  openFilter(filter: CatalogFilter) {
    this.activeFilter = filter;
  }

  closeFilter() {
    this.activeFilter = null;
  }

  setLanguage(value: DeckLanguage) {
    screenStore.replace({
      ...this.route,
      availableIn: value === "any" ? undefined : value,
    });
    this.closeFilter();
  }

  setCategoryId(value: string) {
    screenStore.replace({
      ...this.route,
      categoryId: value || undefined,
    });
    this.closeFilter();
  }

  private get apiFilters(): CatalogFilters {
    return {
      availableIn: this.language === "any" ? undefined : this.language,
      categoryId: this.categoryId || undefined,
    };
  }
}
