import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  runInAction,
} from "mobx";
import { inMemoryCache } from "./cache.ts";
import { toError } from "./to-error.ts";

type QueryConfig<T> = {
  query: () => Promise<T>;
  key: string;
};

type QueryConfigFactory<T> = () => QueryConfig<T>;

export type QueryOptions = {
  gcTime?: number;
  staleTime?: number;
};

export type QueryState<T> = {
  // True while there is no data and no error
  isPending: boolean;
  // True during any fetch
  isFetching: boolean;
  lastFetched: number | null;
  data: T | undefined;
  error: Error | null;
  staleTime: number;
  invalidate: () => Promise<void>;
  prefetch: () => Promise<void>;
  refetch: () => Promise<void>;
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
  private gcTimeout: ReturnType<typeof setTimeout> | undefined;
  private gcTime: number;
  private isActive = false;
  private isInvalidated = false;
  private invalidationId = 0;

  constructor(
    private fetcher: QueryConfig<T>,
    options?: QueryOptions,
  ) {
    const cached = inMemoryCache.get<T>(fetcher.key);

    this.data = cached?.data;
    this.lastFetched = cached?.lastFetched ?? null;
    this.gcTime = options?.gcTime ?? 5 * 60 * 1000;
    this.staleTime = options?.staleTime ?? 5 * 60 * 1000;

    makeObservable(this, {
      data: observable,
      error: observable,
      invalidate: action.bound,
      isFetching: observable,
      isPending: computed,
      lastFetched: observable,
      prefetch: action.bound,
      refetch: action.bound,
      setData: action.bound,
    });

    onBecomeObserved(this, "data", () => {
      this.registerIfMissing();
      this.isActive = true;
      this.clearGcTimeout();

      queueMicrotask(() => {
        this.prefetch();
      });
    });

    onBecomeUnobserved(this, "data", () => {
      this.isActive = false;
      this.scheduleGc();
    });

    this.scheduleGc();
  }

  get isPending() {
    return this.data === undefined && !this.error;
  }

  isStale() {
    if (this.isInvalidated) return true;
    if (!this.lastFetched) return true;
    return Date.now() - this.lastFetched > this.staleTime;
  }

  invalidate() {
    this.registerIfMissing();
    this.scheduleGc();
    this.isInvalidated = true;
    this.invalidationId += 1;

    if (this.isActive) {
      return this.refetch();
    }

    return Promise.resolve();
  }

  prefetch() {
    if (this.isStale() && !this.isFetching) {
      return this.refetch();
    }

    return Promise.resolve();
  }

  async refetch() {
    this.registerIfMissing();
    this.scheduleGc();

    const currentFetchId = this.fetchId + 1;
    const currentInvalidationId = this.invalidationId;
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
      if (this.invalidationId === currentInvalidationId) {
        this.isInvalidated = false;
      }
      inMemoryCache.set(this.fetcher.key, { data, lastFetched });
    });
  }

  setData(data: T | undefined) {
    this.registerIfMissing();
    this.scheduleGc();

    const lastFetched = Date.now();
    this.data = data;
    this.lastFetched = lastFetched;
    this.error = null;
    this.isInvalidated = false;
    inMemoryCache.set(this.fetcher.key, { data, lastFetched });
  }

  private registerIfMissing() {
    if (!queryRegistry.has(this.fetcher.key)) {
      queryRegistry.set(this.fetcher.key, this);
    }
  }

  private clearGcTimeout() {
    if (this.gcTimeout !== undefined) {
      clearTimeout(this.gcTimeout);
      this.gcTimeout = undefined;
    }
  }

  private scheduleGc() {
    this.clearGcTimeout();

    if (this.isActive || this.gcTime === Infinity) {
      return;
    }

    this.gcTimeout = setTimeout(() => {
      this.gcTimeout = undefined;

      if (this.isFetching) {
        this.scheduleGc();
        return;
      }

      if (queryRegistry.get(this.fetcher.key) === this) {
        queryRegistry.delete(this.fetcher.key);
        inMemoryCache.delete(this.fetcher.key);
        runInAction(() => {
          this.data = undefined;
          this.lastFetched = null;
          this.error = null;
        });
      }
    }, Math.max(this.gcTime, 0));
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
  invalidate() {
    return this.currentQuery().invalidate();
  }

  // Alias for the underlying query
  prefetch() {
    return this.currentQuery().prefetch();
  }

  // Alias for the underlying query
  refetch() {
    return this.currentQuery().refetch();
  }

  // Alias for the underlying query
  setData(data: T | undefined) {
    return this.currentQuery().setData(data);
  }
}
