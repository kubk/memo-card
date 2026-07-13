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

      await state.refetch();

      expect(state.isPending).toBe(false);
      expect(state.data).toEqual({ id: 1, name: "Test" });
      expect(state.error).toBe(null);
      expect(query).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch errors", async () => {
      const error = new Error("Fetch failed");
      const query = vi.fn().mockRejectedValue(error);
      const state = makeQuery({ query, key: "test-error" });

      await state.refetch();

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

      await state.refetch();
      await state.refetch();

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

      await state.refetch();
      const refresh = state.refetch();

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

      const firstFetch = state.refetch();
      const secondFetch = state.refetch();

      resolveSecond("second");
      await secondFetch;

      expect(state.data).toBe("second");
      expect(state.isFetching).toBe(false);

      resolveFirst("first");
      await firstFetch;

      expect(state.data).toBe("second");
    });
  });

  describe("query actions", () => {
    it("prefetches stale data without refetching fresh data", async () => {
      const query = vi.fn().mockResolvedValue("data");
      const state = makeQuery(
        { query, key: "prefetch-fresh" },
        { staleTime: 1000 },
      );

      await state.prefetch();
      await state.prefetch();

      expect(state.data).toBe("data");
      expect(query).toHaveBeenCalledTimes(1);
    });

    it("refetches even when data is fresh", async () => {
      const query = vi.fn().mockResolvedValue("data");
      const state = makeQuery(
        { query, key: "refetch-fresh" },
        { staleTime: Infinity },
      );

      await state.prefetch();
      await state.refetch();

      expect(query).toHaveBeenCalledTimes(2);
    });

    it("marks an inactive query stale without immediately refetching", async () => {
      const query = vi.fn().mockResolvedValue("data");
      const state = makeQuery(
        { query, key: "invalidate-inactive" },
        { staleTime: Infinity },
      );

      await state.prefetch();
      await state.invalidate();

      expect(query).toHaveBeenCalledTimes(1);

      await state.prefetch();
      expect(query).toHaveBeenCalledTimes(2);
    });

    it("immediately refetches an inactive query when requested", async () => {
      const query = vi.fn().mockResolvedValue("data");
      const state = makeQuery(
        { query, key: "invalidate-refetch-inactive" },
        { staleTime: Infinity },
      );

      await state.prefetch();
      await state.invalidate({ refetchInactive: true });

      expect(query).toHaveBeenCalledTimes(2);
    });

    it("immediately refetches an active query when invalidated", async () => {
      const query = vi.fn().mockResolvedValue("data");
      const state = makeQuery(
        { query, key: "invalidate-active" },
        { staleTime: Infinity },
      );

      await state.prefetch();
      const dispose = reaction(
        () => state.data,
        () => {},
      );

      await state.invalidate();

      expect(query).toHaveBeenCalledTimes(2);
      dispose();
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

      await state.refetch();
      expect(state.data).toBe("first");

      key.set("second");
      expect(state.data).toBe(undefined);

      await state.refetch();
      expect(state.data).toBe("second");

      key.set("first");
      expect(state.data).toBe("first");
      expect(query).toHaveBeenCalledTimes(2);
    });

    it("fetches the new query when an observed key changes", async () => {
      const key = observable.box("first");
      const query = vi.fn(async (value: string) => value);
      const state = makeQuery(() => {
        const value = key.get();

        return {
          key: `observed-${value}`,
          query: () => query(value),
        };
      });
      const dispose = reaction(
        () => state.data,
        () => {},
      );

      await vi.waitFor(() => {
        expect(state.data).toBe("first");
      });

      key.set("second");

      await vi.waitFor(() => {
        expect(state.data).toBe("second");
      });
      expect(query).toHaveBeenCalledTimes(2);
      dispose();
    });
  });

  describe("cache persistence", () => {
    it("should save data to in-memory cache on fetch", async () => {
      const query = vi.fn().mockResolvedValue({ id: 1 });
      const state = makeQuery({ query, key: "cached-1" });

      await state.refetch();

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

      await state.refetch();

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

      await state.refetch();
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

      await state.refetch();
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

      await state.refetch();
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

  describe("garbage collection", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("removes inactive query state and cached data after gcTime", async () => {
      const state = makeQuery(
        { query: async () => "data", key: "gc-inactive" },
        { gcTime: 1000 },
      );

      await state.refetch();

      expect(queryRegistry.has("gc-inactive")).toBe(true);
      expect(inMemoryCache.get("gc-inactive")?.data).toBe("data");

      await vi.advanceTimersByTimeAsync(1000);

      expect(queryRegistry.has("gc-inactive")).toBe(false);
      expect(inMemoryCache.get("gc-inactive")).toBe(null);
      expect(state.data).toBe(undefined);
      expect(state.lastFetched).toBe(null);
    });

    it("keeps an observed query and starts gcTime when it becomes inactive", async () => {
      const state = makeQuery(
        { query: async () => "data", key: "gc-observed" },
        { gcTime: 1000 },
      );
      const dispose = reaction(
        () => state.data,
        () => {},
      );

      await vi.advanceTimersByTimeAsync(1000);
      expect(queryRegistry.has("gc-observed")).toBe(true);

      dispose();
      await vi.advanceTimersByTimeAsync(999);
      expect(queryRegistry.has("gc-observed")).toBe(true);

      await vi.advanceTimersByTimeAsync(1);
      expect(queryRegistry.has("gc-observed")).toBe(false);
    });

    it("postpones garbage collection while a fetch is running", async () => {
      let resolveFetch!: (data: string) => void;
      const state = makeQuery(
        {
          key: "gc-fetching",
          query: () =>
            new Promise<string>((resolve) => {
              resolveFetch = resolve;
            }),
        },
        { gcTime: 1000 },
      );

      const fetch = state.refetch();
      await vi.advanceTimersByTimeAsync(1000);

      expect(queryRegistry.has("gc-fetching")).toBe(true);

      resolveFetch("data");
      await fetch;
      await vi.advanceTimersByTimeAsync(1000);

      expect(queryRegistry.has("gc-fetching")).toBe(false);
      expect(inMemoryCache.get("gc-fetching")).toBe(null);
    });

    it("garbage collects data set through an evicted query reference", async () => {
      const state = makeQuery(
        { query: async () => "fetched", key: "gc-reused" },
        { gcTime: 1000 },
      );

      await vi.advanceTimersByTimeAsync(1000);
      expect(queryRegistry.has("gc-reused")).toBe(false);

      state.setData("updated");
      expect(queryRegistry.get("gc-reused")).toBe(state);
      expect(inMemoryCache.get("gc-reused")?.data).toBe("updated");

      await vi.advanceTimersByTimeAsync(1000);
      expect(queryRegistry.has("gc-reused")).toBe(false);
      expect(inMemoryCache.get("gc-reused")).toBe(null);
      expect(state.data).toBe(undefined);
    });
  });

  describe("setData", () => {
    it("should allow manual data updates", async () => {
      const query = vi.fn().mockResolvedValue({ id: 1 });
      const state = makeQuery<{ id: number } | null>({
        query,
        key: "manual-1",
      });

      await state.refetch();
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

  describe("refetch", () => {
    it("should refetch data", async () => {
      const query = vi.fn().mockResolvedValue({ id: 1 });
      const state = makeQuery({ query, key: "fetch-1" });

      await state.refetch();

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
