# MobX Query Lite

Small MobX query helper for data that should survive store/component remounts during the current app session.

## API

- `makeQuery(...)`: creates an observable query state.
- `makeInfiniteQuery(...)`: creates an observable cursor-paginated query state.
- `inMemoryCache`: shared session cache used by default.

There is no device-storage cache or pluggable cache contract. Query data is kept in memory for the current app session.

## Basic Usage

```ts
import { makeQuery } from "../../lib/mobx-query-lite/make-query";

type TodoFilter = "all" | "open" | "done";

class TodoStore {
  filter: TodoFilter = "open";

  todosQuery = makeQuery(
    {
      key: "todos.list",
      query: api.todos.list.query,
    },
  );

  get visibleTodos() {
    const todos = this.todosQuery.data ?? [];

    if (this.filter === "open") {
      return todos.filter((todo) => !todo.completed);
    }

    if (this.filter === "done") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }

  get remainingCount() {
    return (this.todosQuery.data ?? []).filter((todo) => !todo.completed)
      .length;
  }
}
```

```tsx
const TodoScreen = observer(() => {
  const todos = store.visibleTodos;

  return (
    <>
      <TodoCounter count={store.remainingCount} />
      {todos.map((todo) => (
        <TodoRow key={todo.id} todo={todo} />
      ))}
    </>
  );
});
```

Reading `store.visibleTodos` from an `observer` component observes the computed getter. That getter reads `todosQuery.data`, so the query becomes observed and starts fetching if the data is stale. The same read also participates in normal MobX derivation: changing `filter` recomputes `visibleTodos`, and fresh query data recomputes both `visibleTodos` and `remainingCount`. Most screens should not need `useEffect(() => store.load(), [])` or a `store.load()` method at all.

## Query Keys

Use a static config by default.

```ts
const currentUserStatsQuery = makeQuery({
  key: "currentUser.stats",
  query: () =>
    api.currentUserStats.query({
      timeZone: getTz(),
    }),
});
```

The key is the logical cache identity for the current app session. Do not add stable runtime context such as the current user id, `"anonymous"`, or local timezone just because the request uses it. Current-user endpoints are already scoped by auth, and the timezone does not change during the session.

Add values to `key` only when they can actually change while the app is running and the old and new results must be cached separately, such as user-editable filters, search text, language selectors, route params, or pagination roots.

## Dynamic Config

Use a dynamic config only when the key or query function depends on observable state that can change during the app session.

```ts
class CatalogStore {
  language = "en";

  catalog = makeQuery(
    () => {
      const language = this.language;

      return {
        key: `catalog.list:${language}`,
        query: () => api.catalog.list.query({ language }),
      };
    },
  );
}
```

When the dynamic key changes, the wrapper points at the query state for the new key. Queries with the same key share the same cached state.

The same automatic fetch behavior works through MobX computed chains. A component can observe `store.filteredDecks`, that getter can read `store.decks`, and `store.decks` can read `catalogQuery.data`; MobX still observes the query data at the end of the chain.

## Infinite Queries

Use `makeInfiniteQuery` for cursor-based pages shaped as `{ items, nextCursor }`.

```ts
class CatalogStore {
  catalogQuery = makeInfiniteQuery(() => {
    const filters = this.filters;

    return {
      key: `catalog.list:${JSON.stringify(filters)}`,
      query: ({ cursor }) =>
        api.catalog.list.query({
          filters,
          cursor,
        }),
    };
  });

}
```

The first page uses the same observed-read fetching behavior as `makeQuery`. `fetchNextPage()` is for scroll/user-triggered pagination and appends returned items to the cached page data.

## Query State

| Property | Description |
| --- | --- |
| `data` | Fetched data, or `undefined` before successful fetch |
| `error` | Last fetch error, or `null` |
| `isPending` | True while there is no data and no error |
| `isFetching` | True during any fetch |
| `lastFetched` | Timestamp of the last successful fetch |
| `staleTime` | Time before observed data should refresh |

| Method | Description |
| --- | --- |
| `fetch()` | Fetch now and update cache |
| `setData(data)` | Manually replace current data and mark it fresh |

## Infinite Query State

| Property | Description |
| --- | --- |
| `data` | Combined page data, or `undefined` before successful fetch |
| `items` | Combined item list, or `[]` before successful fetch |
| `nextCursor` | Cursor for the next page, or `null` |
| `error` | First-page or next-page error, or `null` |
| `isPending` | True while there is no data and no error |
| `isFetching` | True during first-page fetch or next-page fetch |
| `isFetchingNextPage` | True during next-page fetch |
| `hasNextPage` | True when `nextCursor` is not `null` |

| Method | Description |
| --- | --- |
| `fetch()` | Fetch the first page and replace cached data |
| `fetchNextPage()` | Fetch `nextCursor` and append items |

## Fetching

`makeQuery` fetches when `data` becomes observed and the query is stale. Prefer exposing query data through store getters and letting React `observer` reads start the fetch. Call `fetch()` only when a screen needs to fetch before anything reads the data, or when a user action should refresh the query.

Use `isPending` for an initial skeleton or full-screen loader. Use `isFetching` only for a small refresh indicator or disabled state that should appear while existing data remains on screen. A stale query with cached data can have `isFetching === true` and `isPending === false`.
