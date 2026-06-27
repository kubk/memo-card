import { makeAutoObservable, onBecomeObserved, runInAction } from "mobx";
import { inMemoryCache } from "./cache.ts";
import { toError } from "./to-error.ts";

type QueryConfig<T> = {
  query: () => Promise<T>;
  key: string;
};

type QueryConfigFactory<T> = () => QueryConfig<T>;

export type QueryOptions = {
  staleTime?: number;
};

export type QueryState<T> = {
  isPending: boolean;
  isFetching: boolean;
  lastFetched: number | null;
  data: T | undefined;
  error: Error | null;
  staleTime: number;
  fetch: () => Promise<void>;
  setData: (data: T | undefined) => void;
};

export const queryRegistry = new Map<string, QueryState<any>>();

export function makeQuery<T>(
  fetcher: QueryConfig<T> | QueryConfigFactory<T>,
  options?: QueryOptions,
): QueryState<T> {
  if (typeof fetcher === "function") {
    return new DynamicQuery(fetcher, options);
  }

  return makeStaticQuery(fetcher, options);
}

function makeStaticQuery<T>(
  fetcher: QueryConfig<T>,
  options?: QueryOptions,
): QueryState<T> {
  const key = fetcher.key;

  const existing = queryRegistry.get(key) as QueryState<T> | undefined;
  if (existing) {
    return existing;
  }

  const state = new StaticQuery(fetcher, options);

  queryRegistry.set(key, state);

  return state;
}

class StaticQuery<T> implements QueryState<T> {
  data: T | undefined;
  isFetching = false;
  lastFetched: number | null;
  error: Error | null = null;
  staleTime: number;
  private fetchId = 0;

  constructor(
    private fetcher: QueryConfig<T>,
    options?: QueryOptions,
  ) {
    const cached = inMemoryCache.get<T>(fetcher.key);

    this.data = cached?.data;
    this.lastFetched = cached?.lastFetched ?? null;
    this.staleTime = options?.staleTime ?? 5 * 60 * 1000;

    makeAutoObservable<this, "fetcher" | "fetchId">(
      this,
      {
        fetcher: false,
        fetchId: false,
      },
      { autoBind: true },
    );

    onBecomeObserved(this, "data", () => {
      queueMicrotask(() => {
        this.fetchIfStale();
      });
    });
  }

  get isPending() {
    return this.data === undefined && !this.error;
  }

  isStale() {
    if (!this.lastFetched) return true;
    return Date.now() - this.lastFetched > this.staleTime;
  }

  async fetch() {
    const currentFetchId = this.fetchId + 1;
    this.fetchId = currentFetchId;
    this.isFetching = true;
    this.error = null;

    let data: T;
    try {
      data = await this.fetcher.query();
    } catch (error) {
      runInAction(() => {
        if (this.fetchId !== currentFetchId) {
          return;
        }

        this.error = toError(error);
        this.isFetching = false;
      });
      return;
    }

    const lastFetched = Date.now();
    runInAction(() => {
      if (this.fetchId !== currentFetchId) {
        return;
      }

      this.data = data;
      this.lastFetched = lastFetched;
      this.isFetching = false;
      inMemoryCache.set(this.fetcher.key, { data, lastFetched });
    });
  }

  async fetchIfStale() {
    if (this.isStale() && !this.isFetching) {
      await this.fetch();
    }
  }

  setData(data: T | undefined) {
    const lastFetched = Date.now();
    this.data = data;
    this.lastFetched = lastFetched;
    this.error = null;
    inMemoryCache.set(this.fetcher.key, { data, lastFetched });
  }
}

class DynamicQuery<T> implements QueryState<T> {
  constructor(
    private getConfig: QueryConfigFactory<T>,
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
    return makeStaticQuery(this.getConfig(), this.options);
  }

  get data() {
    return this.currentQuery().data;
  }

  get error() {
    return this.currentQuery().error;
  }

  get isPending() {
    return this.currentQuery().isPending;
  }

  get isFetching() {
    return this.currentQuery().isFetching;
  }

  get lastFetched() {
    return this.currentQuery().lastFetched;
  }

  get staleTime() {
    return this.currentQuery().staleTime;
  }

  // Alias for the underlying query
  fetch() {
    return this.currentQuery().fetch();
  }

  // Alias for the underlying query
  setData(data: T | undefined) {
    return this.currentQuery().setData(data);
  }
}
