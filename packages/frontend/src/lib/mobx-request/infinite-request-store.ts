import { makeAutoObservable, runInAction } from "mobx";

export type InfinitePageResult<Item, Cursor> = {
  items: Item[];
  nextCursor: Cursor | null;
};

export type InfiniteRequestOptions<Item, Filters> = {
  pageSize?: number;
  getFilters?: () => Filters;
  getItemKey?: (item: Item) => string;
};

export class InfiniteRequestStore<
  Item,
  Cursor,
  Filters extends Record<string, unknown> = Record<string, never>,
> {
  items: Item[] = [];
  nextCursor: Cursor | null = null;
  hasLoaded = false;
  isInitialLoading = false;
  isLoadingMore = false;
  loadError: unknown = null;

  constructor(
    private fetchPage: (
      input: { limit: number; cursor?: Cursor } & Filters,
    ) => Promise<InfinitePageResult<Item, Cursor>>,
    private options?: InfiniteRequestOptions<Item, Filters>,
  ) {
    makeAutoObservable<this, "fetchPage">(
      this,
      { fetchPage: false },
      { autoBind: true },
    );
  }

  private get pageSize() {
    return this.options?.pageSize ?? 30;
  }

  private get filters(): Filters {
    return this.options?.getFilters?.() ?? ({} as Filters);
  }

  async reload() {
    this.hasLoaded = true;
    this.isInitialLoading = true;
    this.isLoadingMore = false;
    this.loadError = null;
    this.items = [];
    this.nextCursor = null;

    try {
      const result = await this.fetchPage({
        limit: this.pageSize,
        ...this.filters,
      });

      runInAction(() => {
        this.isInitialLoading = false;
        this.items = result.items;
        this.nextCursor = result.nextCursor;
      });
    } catch (error) {
      runInAction(() => {
        this.isInitialLoading = false;
        this.loadError = error;
      });
    }
  }

  async loadMore() {
    if (this.isInitialLoading || this.isLoadingMore || !this.nextCursor) {
      return;
    }

    this.isLoadingMore = true;
    this.loadError = null;
    const cursor = this.nextCursor;

    try {
      const result = await this.fetchPage({
        limit: this.pageSize,
        cursor,
        ...this.filters,
      });

      runInAction(() => {
        this.isLoadingMore = false;
        if (this.options?.getItemKey) {
          const seen = new Set(this.items.map(this.options.getItemKey));
          for (const item of result.items) {
            const key = this.options.getItemKey(item);
            if (!seen.has(key)) {
              this.items.push(item);
              seen.add(key);
            }
          }
        } else {
          this.items.push(...result.items);
        }
        this.nextCursor = result.nextCursor;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingMore = false;
        this.loadError = error;
      });
    }
  }
}
