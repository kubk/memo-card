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

  if (store.todosQuery.isPending) {
    return <Loader />;
  }

  if (store.todosQuery.error) {
    return <p>Failed to load</p>;
  }

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

When the dynamic key changes, the wrapper points at the query state for the new key. If the query data is observed, missing or stale data for the new key is fetched automatically. Queries with the same key share the same cached state.

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
| `prefetch()` | Fetch only when data is missing, stale, or invalidated |
| `invalidate()` | Mark data stale and immediately refetch it when active |
| `refetch()` | Force a request regardless of freshness |
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
| `prefetch()` | Fetch the first page when it is missing, stale, or invalidated |
| `invalidate()` | Mark the first page stale and immediately refetch it when active |
| `refetch()` | Force a first-page request and replace combined page data |
| `fetchNextPage()` | Fetch `nextCursor` and append items |

## Fetching

`makeQuery` calls `prefetch()` when `data` becomes observed. Prefer exposing query data through store getters and letting React `observer` reads load missing, stale, or invalidated data. Call `prefetch()` before observation only when a flow needs to ensure fresh data is available early. After a mutation, call `invalidate()` so active data refreshes immediately and inactive data refreshes on its next observation. Reserve `refetch()` for the rare flow that must force and await a request regardless of freshness.

Inactive queries are removed from the query registry and in-memory cache after `gcTime`, which defaults to five minutes. Observing `data` cancels garbage collection; the full delay starts again when the data becomes unobserved. Set `gcTime: Infinity` only for data that must remain cached for the lifetime of the app.

Use `isPending` for an initial skeleton or full-screen loader. Use `isFetching` only for a small refresh indicator or disabled state that should appear while existing data remains on screen. A stale query with cached data can have `isFetching === true` and `isPending === false`.

## Error Handling

Query functions should only fetch and shape data. `makeQuery` captures rejected promises in the observable `error` property, so render request failures from an observed React component.

```tsx
function TodoScreen() {
  if (store.todosQuery.error) {
    return <TodoLoadError />;
  }

  return <TodoList todos={store.visibleTodos} />;
}
```

Do not catch an error inside a query function merely to show a snackbar and rethrow it.
Catch inside the query only when the error must be converted into domain data or another error type.

## Anti-Patterns

- **`useEffect(() => store.load(), [])`.** Do not call a store `.load()` on mount only to fetch a query. When an `observer` component reads `query.data`, directly or through a computed getter, `makeQuery` fetches stale data automatically. The query state is observable, so MobX re-renders the component when it changes. A `.load()` wrapper around `query.prefetch()` is redundant.
- **Fetching after changing dynamic query inputs.** An action that applies filters, a route parameter, or another observable query input should only update that state. If the dynamic query is observed, its key updates and missing or stale data for the new key is fetched automatically. Do not call `prefetch()` or `refetch()` immediately after changing the input.
- **Adding session-stable context to a key.** Current-user ids, `"anonymous"`, and the local timezone do not belong in a key when they cannot change during the session. Use dynamic keys only for values whose changes need distinct cached results.
- Do not catch a request error only to show a notification and rethrow it. Render the observable query error in React.
