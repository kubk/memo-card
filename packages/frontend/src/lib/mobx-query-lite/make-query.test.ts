import { observable, reaction } from "mobx";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { inMemoryCache } from "./cache.ts";
import { makeQuery, queryRegistry } from "./make-query.ts";

describe("makeQuery", () => {
  beforeEach(() => {
    queryRegistry.clear();
    inMemoryCache.clear();
  });

  describe("basic fetching", () => {
    it("should fetch data successfully", async () => {
      const query = vi.fn().mockResolvedValue({ id: 1, name: "Test" });
      const state = makeQuery({ query, key: "test-1" });

      expect(state.isPending).toBe(true);
      expect(state.data).toBe(undefined);

      await state.fetch();

      expect(state.isPending).toBe(false);
      expect(state.data).toEqual({ id: 1, name: "Test" });
      expect(state.error).toBe(null);
      expect(query).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch errors", async () => {
      const error = new Error("Fetch failed");
      const query = vi.fn().mockRejectedValue(error);
      const state = makeQuery({ query, key: "test-error" });

      await state.fetch();

      expect(state.isPending).toBe(false);
      expect(state.data).toBe(undefined);
      expect(state.error).toBe(error);
    });

    it("keeps existing data when a refetch fails", async () => {
      const error = new Error("Fetch failed");
      const query = vi
        .fn()
        .mockResolvedValueOnce("old-data")
        .mockRejectedValueOnce(error);
      const state = makeQuery({ query, key: "refetch-error" });

      await state.fetch();
      await state.fetch();

      expect(state.data).toBe("old-data");
      expect(state.error).toBe(error);
    });

    it("keeps pending false while cached data refreshes", async () => {
      let resolveRefresh!: (data: string) => void;
      const query = vi
        .fn()
        .mockResolvedValueOnce("old-data")
        .mockImplementationOnce(
          () =>
            new Promise<string>((resolve) => {
              resolveRefresh = resolve;
            }),
        );
      const state = makeQuery({ query, key: "swr-pending" });

      await state.fetch();
      const refresh = state.fetch();

      expect(state.data).toBe("old-data");
      expect(state.isFetching).toBe(true);
      expect(state.isPending).toBe(false);

      resolveRefresh("fresh-data");
      await refresh;

      expect(state.data).toBe("fresh-data");
    });

    it("ignores older fetch results after a newer fetch starts", async () => {
      let resolveFirst!: (data: string) => void;
      let resolveSecond!: (data: string) => void;
      const query = vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise<string>((resolve) => {
              resolveFirst = resolve;
            }),
        )
        .mockImplementationOnce(
          () =>
            new Promise<string>((resolve) => {
              resolveSecond = resolve;
            }),
        );
      const state = makeQuery({ query, key: "latest-fetch-wins" });

      const firstFetch = state.fetch();
      const secondFetch = state.fetch();

      resolveSecond("second");
      await secondFetch;

      expect(state.data).toBe("second");
      expect(state.isFetching).toBe(false);

      resolveFirst("first");
      await firstFetch;

      expect(state.data).toBe("second");
    });
  });

  describe("registry deduplication", () => {
    it("should return same instance for same query key", () => {
      const query = vi.fn().mockResolvedValue("data");
      const state1 = makeQuery({ query, key: "same-key" });
      const state2 = makeQuery({ query, key: "same-key" });

      expect(state1).toBe(state2);
    });

    it("should return different instances for different query keys", () => {
      const query = vi.fn().mockResolvedValue("data");
      const state1 = makeQuery({ query, key: "key-1" });
      const state2 = makeQuery({ query, key: "key-2" });

      expect(state1).not.toBe(state2);
    });
  });

  describe("dynamic config", () => {
    it("switches query instances when the computed key changes", async () => {
      const key = observable.box("first");
      const query = vi.fn(async (value: string) => value);
      const state = makeQuery(() => {
        const value = key.get();

        return {
          key: `computed-${value}`,
          query: () => query(value),
        };
      });

      await state.fetch();
      expect(state.data).toBe("first");

      key.set("second");
      expect(state.data).toBe(undefined);

      await state.fetch();
      expect(state.data).toBe("second");

      key.set("first");
      expect(state.data).toBe("first");
      expect(query).toHaveBeenCalledTimes(2);
    });
  });

  describe("cache persistence", () => {
    it("should save data to in-memory cache on fetch", async () => {
      const query = vi.fn().mockResolvedValue({ id: 1 });
      const state = makeQuery({ query, key: "cached-1" });

      await state.fetch();

      const cached = inMemoryCache.get("cached-1");
      if (!cached) {
        throw new Error("Expected cached data");
      }
      expect(cached.data).toEqual({ id: 1 });
      expect(cached.lastFetched).toBeTypeOf("number");
    });

    it("should load data from in-memory cache on initialization", () => {
      const lastFetched = Date.now() - 1000;
      inMemoryCache.set("cached-3", {
        data: { id: 99, name: "Cached" },
        lastFetched,
      });

      const query = vi.fn().mockResolvedValue({ id: 100 });
      const state = makeQuery({ query, key: "cached-3" });

      expect(state.data).toEqual({ id: 99, name: "Cached" });
      expect(state.lastFetched).toBe(lastFetched);
      expect(state.isPending).toBe(false);
    });

    it("should work without prefilled cache", async () => {
      const query = vi.fn().mockResolvedValue({ id: 5 });
      const state = makeQuery({ query, key: "no-cache" });

      await state.fetch();

      expect(state.data).toEqual({ id: 5 });
      expect(state.error).toBe(null);
    });
  });

  describe("stale time", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should refetch when data is observed after becoming stale", async () => {
      const query = vi.fn().mockResolvedValue("data");
      const state = makeQuery(
        { query, key: "stale-refetch-on-observe" },
        { staleTime: 1000 },
      );

      await state.fetch();
      expect(query).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1001);

      const dispose = reaction(
        () => state.data,
        () => {},
      );

      await vi.runAllTimersAsync();

      expect(query).toHaveBeenCalledTimes(2);
      dispose();
    });

    it("should not refetch when data is observed before staleTime", async () => {
      const query = vi.fn().mockResolvedValue("data");
      const state = makeQuery(
        { query, key: "stale-no-refetch" },
        { staleTime: 1000 },
      );

      await state.fetch();
      expect(query).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(500);

      const dispose = reaction(
        () => state.data,
        () => {},
      );

      await vi.runAllTimersAsync();

      expect(query).toHaveBeenCalledTimes(1);
      dispose();
    });

    it("should refetch when data is observed well past staleTime", async () => {
      const query = vi.fn().mockResolvedValue("data");
      const state = makeQuery(
        { query, key: "stale-refetch-1500" },
        { staleTime: 1000 },
      );

      await state.fetch();
      expect(query).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1500);

      const dispose = reaction(
        () => state.data,
        () => {},
      );

      await vi.runAllTimersAsync();

      expect(query).toHaveBeenCalledTimes(2);
      dispose();
    });
  });

  describe("setData", () => {
    it("should allow manual data updates", async () => {
      const query = vi.fn().mockResolvedValue({ id: 1 });
      const state = makeQuery<{ id: number } | null>({
        query,
        key: "manual-1",
      });

      await state.fetch();
      expect(state.data).toEqual({ id: 1 });

      state.setData({ id: 2 });
      expect(state.data).toEqual({ id: 2 });

      state.setData(null);
      expect(state.data).toBe(null);
    });

    it("should update in-memory cache when setData is called", () => {
      const query = vi.fn().mockResolvedValue({ id: 1 });
      const state = makeQuery({ query, key: "setdata-cache" });

      state.setData({ id: 99 });
      expect(state.data).toEqual({ id: 99 });
      const cached = inMemoryCache.get("setdata-cache");
      expect(cached?.data).toEqual({ id: 99 });
    });
  });

  describe("fetch", () => {
    it("should fetch data", async () => {
      const query = vi.fn().mockResolvedValue({ id: 1 });
      const state = makeQuery({ query, key: "fetch-1" });

      await state.fetch();

      expect(state.data).toEqual({ id: 1 });
      expect(query).toHaveBeenCalledTimes(1);
    });
  });

  describe("cache + staleTime integration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should refetch stale cached data when observed", async () => {
      const lastFetched = Date.now() - 2000;
      inMemoryCache.set("cache-stale-test", {
        data: { id: 1, name: "Old" },
        lastFetched,
      });

      const query = vi.fn().mockResolvedValue({ id: 2, name: "Fresh" });
      const state = makeQuery(
        { query, key: "cache-stale-test" },
        { staleTime: 1000 },
      );

      expect(state.data).toEqual({ id: 1, name: "Old" });
      expect(state.lastFetched).toBe(lastFetched);
      expect(query).not.toHaveBeenCalled();

      const dispose = reaction(
        () => state.data,
        () => {},
      );

      await vi.runAllTimersAsync();

      expect(query).toHaveBeenCalledTimes(1);
      expect(state.data).toEqual({ id: 2, name: "Fresh" });
      dispose();
    });

    it("should NOT refetch fresh cached data when observed", async () => {
      const lastFetched = Date.now() - 500;
      inMemoryCache.set("cache-fresh-test", {
        data: { id: 1, name: "Cached" },
        lastFetched,
      });

      const query = vi.fn().mockResolvedValue({ id: 2, name: "Fresh" });
      const state = makeQuery(
        { query, key: "cache-fresh-test" },
        { staleTime: 1000 },
      );

      expect(state.data).toEqual({ id: 1, name: "Cached" });

      const dispose = reaction(
        () => state.data,
        () => {},
      );
      await vi.runAllTimersAsync();

      expect(query).not.toHaveBeenCalled();
      dispose();
    });
  });
});
