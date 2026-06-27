import { observable } from "mobx";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { inMemoryCache } from "./cache.ts";
import { makeInfiniteQuery } from "./make-infinite-query.ts";
import { queryRegistry } from "./make-query.ts";

describe("makeInfiniteQuery", () => {
  beforeEach(() => {
    queryRegistry.clear();
    inMemoryCache.clear();
  });

  it("fetches the first page through fetch", async () => {
    const query = vi.fn().mockResolvedValue({
      items: [1, 2],
      nextCursor: "next",
    });
    const state = makeInfiniteQuery({
      key: "infinite-first-page",
      query,
    });

    await state.fetch();

    expect(state.items).toEqual([1, 2]);
    expect(state.nextCursor).toBe("next");
    expect(query).toHaveBeenCalledWith({});
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

    await state.fetch();
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

    await state.fetch();
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

    await state.fetch();
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

    await state.fetch();
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

    await state.fetch();
    await state.fetchNextPage();

    expect(state.error).toBeInstanceOf(Error);
    expect(state.error?.message).toBe("Failed");
  });

  it("switches pages when the computed key changes", async () => {
    const key = observable.box("first");
    const query = vi.fn(async () => ({
      items: [key.get()],
      nextCursor: null,
    }));
    const state = makeInfiniteQuery(() => ({
      key: `infinite-computed:${key.get()}`,
      query,
    }));

    await state.fetch();
    expect(state.items).toEqual(["first"]);

    key.set("second");
    expect(state.items).toEqual([]);

    await state.fetch();
    expect(state.items).toEqual(["second"]);
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

    await state.fetch();
    await state.fetchNextPage();

    expect(state.error).toBe(error);

    key.set("second");

    expect(state.error).toBe(null);
    expect(state.isFetchingNextPage).toBe(false);
  });
});
