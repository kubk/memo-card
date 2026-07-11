import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { observable } from "mobx";
import { createApiProxy } from "./create-api-proxy.ts";
import { inMemoryCache } from "../lib/mobx-query-lite/cache.ts";
import { makeQuery, queryRegistry } from "../lib/mobx-query-lite/make-query.ts";

type Deck = {
  id: number;
  name: string;
};

describe("createApiProxy", () => {
  beforeEach(() => {
    queryRegistry.clear();
    inMemoryCache.clear();
  });

  it("creates a query config with the procedure path as its key", async () => {
    const decks = [{ id: 1, name: "Spanish" }];
    const query = vi.fn(async (): Promise<Array<Deck>> => decks);
    const api = {
      deck: {
        decksCreatedByMe: { query },
      },
    };

    const config = createApiProxy(api).deck.decksCreatedByMe.query();

    expect(config.key).toBe("deck.decksCreatedByMe");
    expectTypeOf(config.key).toEqualTypeOf<"deck.decksCreatedByMe">();
    expect(config.query).toBe(query);
    await expect(config.query()).resolves.toEqual(decks);
  });

  it("keeps sibling procedure paths and query functions separate", () => {
    const decksQuery = vi.fn(async () => ["deck"]);
    const foldersQuery = vi.fn(async () => ["folder"]);
    const apiProxy = createApiProxy({
      library: {
        decks: { query: decksQuery },
        folders: { query: foldersQuery },
      },
    });

    const decksConfig = apiProxy.library.decks.query();
    const foldersConfig = apiProxy.library.folders.query();

    expect(decksConfig).toEqual({
      key: "library.decks",
      query: decksQuery,
    });
    expect(foldersConfig).toEqual({
      key: "library.folders",
      query: foldersQuery,
    });
  });

  it("binds query input and includes it in the key", async () => {
    const query = vi.fn(async ({ id }: { id: number }) => ({ id }));
    const queryConfig = createApiProxy({
      deck: {
        byId: { query },
      },
    }).deck.byId.query;
    const config = queryConfig({ id: 42 });

    expectTypeOf(queryConfig).parameter(0).toEqualTypeOf<{ id: number }>();
    expectTypeOf(config.query).parameters.toEqualTypeOf<[]>();
    expect(config.key).toBe('deck.byId:{"id":42}');
    await expect(config.query()).resolves.toEqual({ id: 42 });
    expect(query).toHaveBeenCalledWith({ id: 42 });
  });

  it("creates stable, distinct keys from query input", () => {
    const query = vi.fn(
      async (input: { id: number; language: string }) => input,
    );
    const queryConfig = createApiProxy({ deck: { byId: { query } } }).deck.byId
      .query;

    const first = queryConfig({ id: 1, language: "en" });
    const reordered = queryConfig({ language: "en", id: 1 });
    const second = queryConfig({ id: 2, language: "en" });

    expect(first.key).toBe(reordered.key);
    expect(first.key).not.toBe(second.key);
  });

  it("forwards query request options without adding them to the key", async () => {
    const query = vi.fn(
      async (input: { id: number }, options?: { signal: AbortSignal }) => ({
        input,
        options,
      }),
    );
    const queryConfig = createApiProxy({ deck: { byId: { query } } }).deck.byId
      .query;
    const controller = new AbortController();
    const config = queryConfig({ id: 42 }, { signal: controller.signal });

    expect(config.key).toBe('deck.byId:{"id":42}');
    await config.query();
    expect(query).toHaveBeenCalledWith(
      { id: 42 },
      { signal: controller.signal },
    );
  });

  it("supports a router segment named query", () => {
    const query = vi.fn(async () => "ok");
    const config = createApiProxy({
      query: {
        status: { query },
      },
    }).query.status.query();

    expect(config).toEqual({ key: "query.status", query });
  });

  it("can be passed directly to makeQuery and preserves the result type", async () => {
    const decks = [{ id: 1, name: "Spanish" }];
    const query = vi.fn(async (): Promise<Array<Deck>> => decks);
    const apiProxy = createApiProxy({
      deck: {
        decksCreatedByMe: { query },
      },
    });

    const state = makeQuery(apiProxy.deck.decksCreatedByMe.query);

    expectTypeOf(state.data).toEqualTypeOf<Array<Deck> | undefined>();
    await state.prefetch();

    expect(state.data).toEqual(decks);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("passes an input-bearing query config directly to makeQuery", async () => {
    const query = vi.fn(async ({ id }: { id: number }) => ({ id }));
    const apiProxy = createApiProxy({ deck: { byId: { query } } });

    const state = makeQuery(apiProxy.deck.byId.query({ id: 42 }));

    expectTypeOf(state.data).toEqualTypeOf<{ id: number } | undefined>();
    await state.prefetch();

    expect(state.data).toEqual({ id: 42 });
  });

  it("switches cached query state when observable input changes", async () => {
    const id = observable.box(1);
    const query = vi.fn(async (input: { id: number }) => input);
    const apiProxy = createApiProxy({ deck: { byId: { query } } });
    const state = makeQuery(() => apiProxy.deck.byId.query({ id: id.get() }));

    await state.prefetch();
    expect(state.data).toEqual({ id: 1 });

    id.set(2);
    expect(state.data).toBeUndefined();

    await state.prefetch();
    expect(state.data).toEqual({ id: 2 });

    id.set(1);
    expect(state.data).toEqual({ id: 1 });
    expect(query).toHaveBeenCalledTimes(2);
  });
});
