import { observable, reaction } from "mobx";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { inMemoryCache } from "./cache.ts";
import { makeInfiniteQuery } from "./make-infinite-query.ts";
import { queryRegistry } from "./make-query.ts";

describe("makeInfiniteQuery", () => {
  beforeEach(() => {
    queryRegistry.clear();
    inMemoryCache.clear();
  });

  it("prefetches the first page", async () => {
    const query = vi.fn().mockResolvedValue({
      items: [1, 2],
      nextCursor: "next",
    });
    const state = makeInfiniteQuery({
      key: "infinite-first-page",
      query,
    });

    await state.prefetch();

    expect(state.items).toEqual([1, 2]);
    expect(state.nextCursor).toBe("next");
    expect(query).toHaveBeenCalledWith({});
  });

  it("immediately refetches an inactive first page when requested", async () => {
    const query = vi.fn().mockResolvedValue({
      items: [1, 2],
      nextCursor: null,
    });
    const state = makeInfiniteQuery({
      key: "infinite-refetch-inactive",
      query,
    });

    await state.prefetch();
    await state.invalidate({ refetchInactive: true });

    expect(query).toHaveBeenCalledTimes(2);
  });

  it("appends the next page", async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({ items: [1, 2], nextCursor: "next" })
      .mockResolvedValueOnce({ items: [3, 4], nextCursor: null });
    const state = makeInfiniteQuery({
      key: "infinite-next-page",
      query,
    });

    await state.prefetch();
    await state.fetchNextPage();

    expect(state.items).toEqual([1, 2, 3, 4]);
    expect(state.nextCursor).toBe(null);
    expect(query).toHaveBeenLastCalledWith({ cursor: "next" });
  });

  it("fetches the next page when the cursor is zero", async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({ items: [1], nextCursor: 0 })
      .mockResolvedValueOnce({ items: [2], nextCursor: null });
    const state = makeInfiniteQuery({
      key: "infinite-zero-cursor",
      query,
    });

    await state.prefetch();
    await state.fetchNextPage();

    expect(state.items).toEqual([1, 2]);
    expect(query).toHaveBeenLastCalledWith({ cursor: 0 });
  });

  it("does not fetch the next page twice while a page is loading", async () => {
    let resolveNextPage: (page: {
      items: number[];
      nextCursor: string | null;
    }) => void;
    const query = vi
      .fn()
      .mockResolvedValueOnce({ items: [1], nextCursor: "next" })
      .mockImplementationOnce(
        () =>
          new Promise<{ items: number[]; nextCursor: string | null }>(
            (resolve) => {
              resolveNextPage = resolve;
            },
          ),
      );
    const state = makeInfiniteQuery({
      key: "infinite-next-page-dedupe",
      query,
    });

    await state.prefetch();
    const firstRequest = state.fetchNextPage();
    const secondRequest = state.fetchNextPage();

    expect(query).toHaveBeenCalledTimes(2);

    resolveNextPage!({ items: [2], nextCursor: null });
    await Promise.all([firstRequest, secondRequest]);

    expect(state.items).toEqual([1, 2]);
    expect(query).toHaveBeenCalledTimes(2);
  });

  it("stores next page errors without dropping existing items", async () => {
    const error = new Error("Failed");
    const query = vi
      .fn()
      .mockResolvedValueOnce({ items: [1], nextCursor: "next" })
      .mockRejectedValueOnce(error);
    const state = makeInfiniteQuery({
      key: "infinite-next-page-error",
      query,
    });

    await state.prefetch();
    await state.fetchNextPage();

    expect(state.items).toEqual([1]);
    expect(state.error).toBe(error);
    expect(state.isFetchingNextPage).toBe(false);
  });

  it("normalizes non-Error next page errors", async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({ items: [1], nextCursor: "next" })
      .mockRejectedValueOnce("Failed");
    const state = makeInfiniteQuery({
      key: "infinite-next-page-string-error",
      query,
    });

    await state.prefetch();
    await state.fetchNextPage();

    expect(state.error).toBeInstanceOf(Error);
    expect(state.error?.message).toBe("Failed");
  });

  it("fetches the new first page when an observed key changes", async () => {
    const key = observable.box("first");
    const query = vi.fn(async (value: string) => ({
      items: [value],
      nextCursor: null,
    }));
    const state = makeInfiniteQuery(() => {
      const value = key.get();

      return {
        key: `infinite-computed:${value}`,
        query: () => query(value),
      };
    });
    const dispose = reaction(
      () => state.items,
      () => {},
    );

    await vi.waitFor(() => {
      expect(state.items).toEqual(["first"]);
    });

    key.set("second");

    await vi.waitFor(() => {
      expect(state.items).toEqual(["second"]);
    });
    expect(query).toHaveBeenCalledTimes(2);
    dispose();
  });

  it("does not expose next page errors from another computed key", async () => {
    const key = observable.box("first");
    const error = new Error("Failed");
    const query = vi
      .fn()
      .mockResolvedValueOnce({ items: ["first"], nextCursor: "next" })
      .mockRejectedValueOnce(error);
    const state = makeInfiniteQuery(() => ({
      key: `infinite-error-key:${key.get()}`,
      query,
    }));

    await state.prefetch();
    await state.fetchNextPage();

    expect(state.error).toBe(error);

    key.set("second");

    expect(state.error).toBe(null);
    expect(state.isFetchingNextPage).toBe(false);
  });

  describe("garbage collection", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("garbage collects combined page data after it becomes inactive", async () => {
      const state = makeInfiniteQuery(
        {
          key: "infinite-gc",
          query: async () => ({ items: [1, 2], nextCursor: null }),
        },
        { gcTime: 1000 },
      );
      const dispose = reaction(
        () => state.items,
        () => {},
      );

      await vi.runAllTimersAsync();
      expect(queryRegistry.has("infinite-gc")).toBe(true);

      dispose();
      await vi.advanceTimersByTimeAsync(1000);

      expect(queryRegistry.has("infinite-gc")).toBe(false);
      expect(inMemoryCache.get("infinite-gc")).toBe(null);
    });
  });
});
