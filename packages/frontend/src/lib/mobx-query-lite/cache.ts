type InMemoryCacheValue<T = unknown> = {
  data: T | undefined;
  lastFetched: number | null;
};

const storage = new Map<string, InMemoryCacheValue>();

export const inMemoryCache = {
  get<T = unknown>(key: string) {
    return (storage.get(key) as InMemoryCacheValue<T> | undefined) ?? null;
  },

  set<T = unknown>(key: string, value: InMemoryCacheValue<T>) {
    storage.set(key, value);
  },

  clear() {
    storage.clear();
  },

  delete(key: string) {
    storage.delete(key);
  },

  entries() {
    return Array.from(storage.entries());
  },
};
