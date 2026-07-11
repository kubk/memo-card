import { makeAutoObservable, runInAction } from "mobx";
import { makeQuery, type QueryOptions } from "./make-query.ts";
import { toError } from "./to-error.ts";

export type InfiniteQueryInput<Cursor> = {
  cursor?: Cursor;
};

export type InfiniteQueryPage<Item, Cursor> = {
  items: Item[];
  nextCursor: Cursor | null;
};

type AnyInfiniteQueryPage = InfiniteQueryPage<any, any>;

type InfiniteQueryItem<Page extends AnyInfiniteQueryPage> =
  Page["items"][number];

type InfiniteQueryCursor<Page extends AnyInfiniteQueryPage> = NonNullable<
  Page["nextCursor"]
>;

type InfiniteQueryConfig<Page extends AnyInfiniteQueryPage> = {
  query: (
    input: InfiniteQueryInput<InfiniteQueryCursor<Page>>,
  ) => Promise<Page>;
  key: string;
};

type InfiniteQueryConfigFactory<Page extends AnyInfiniteQueryPage> =
  () => InfiniteQueryConfig<Page>;

export type InfiniteQueryState<Item, Cursor> = {
  data: InfiniteQueryPage<Item, Cursor> | undefined;
  items: Item[];
  nextCursor: Cursor | null;
  error: Error | null;
  isPending: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  invalidate: () => Promise<void>;
  prefetch: () => Promise<void>;
  refetch: () => Promise<void>;
};

export function makeInfiniteQuery<Page extends AnyInfiniteQueryPage>(
  fetcher: InfiniteQueryConfig<Page> | InfiniteQueryConfigFactory<Page>,
  options?: QueryOptions,
): InfiniteQueryState<InfiniteQueryItem<Page>, InfiniteQueryCursor<Page>> {
  const getConfig = typeof fetcher === "function" ? fetcher : () => fetcher;

  return new InfiniteQuery(getConfig, options);
}

class InfiniteQuery<
  Page extends AnyInfiniteQueryPage,
> implements InfiniteQueryState<
  InfiniteQueryItem<Page>,
  InfiniteQueryCursor<Page>
> {
  nextPageFetchKey: string | null = null;
  nextPageError: Error | null = null;
  nextPageErrorKey: string | null = null;

  constructor(
    private getConfig: InfiniteQueryConfigFactory<Page>,
    private options?: QueryOptions,
  ) {
    makeAutoObservable<this, "getConfig" | "options" | "currentQuery">(
      this,
      {
        getConfig: false,
        options: false,
        currentQuery: false,
      },
      { autoBind: true },
    );
  }

  private currentQuery() {
    const config = this.getConfig();
    return makeQuery<
      InfiniteQueryPage<InfiniteQueryItem<Page>, InfiniteQueryCursor<Page>>
    >(
      {
        key: config.key,
        query: () => config.query({}),
      },
      this.options,
    );
  }

  get data() {
    return this.currentQuery().data;
  }

  get items() {
    return this.data?.items ?? [];
  }

  get nextCursor() {
    return this.data?.nextCursor ?? null;
  }

  get hasNextPage() {
    return this.nextCursor !== null;
  }

  get error() {
    const query = this.currentQuery();
    if (query.error) {
      return query.error;
    }

    if (this.nextPageErrorKey === this.getConfig().key) {
      return this.nextPageError;
    }

    return null;
  }

  get isPending() {
    return this.currentQuery().isPending;
  }

  get isFetching() {
    return this.currentQuery().isFetching || this.isFetchingNextPage;
  }

  get isFetchingNextPage() {
    return this.nextPageFetchKey === this.getConfig().key;
  }

  invalidate() {
    this.nextPageError = null;
    this.nextPageErrorKey = null;
    return this.currentQuery().invalidate();
  }

  // Alias for the underlying query
  prefetch() {
    return this.currentQuery().prefetch();
  }

  refetch() {
    this.nextPageError = null;
    this.nextPageErrorKey = null;
    return this.currentQuery().refetch();
  }

  async fetchNextPage() {
    const config = this.getConfig();
    const query = this.currentQuery();
    const currentPage = query.data;
    const key = config.key;

    if (
      query.isFetching ||
      this.nextPageFetchKey === key ||
      !currentPage ||
      currentPage.nextCursor === null
    ) {
      return;
    }

    this.nextPageFetchKey = key;
    this.nextPageError = null;
    this.nextPageErrorKey = null;

    try {
      const result = await config.query({
        cursor: currentPage.nextCursor,
      });

      query.setData({
        items: currentPage.items.concat(result.items),
        nextCursor: result.nextCursor,
      });

      runInAction(() => {
        if (this.nextPageFetchKey === key) {
          this.nextPageFetchKey = null;
        }
      });
    } catch (error) {
      runInAction(() => {
        if (this.nextPageFetchKey === key) {
          this.nextPageFetchKey = null;
        }
        this.nextPageError = toError(error);
        this.nextPageErrorKey = key;
      });
    }
  }
}
