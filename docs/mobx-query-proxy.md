# `apiProxy` with `makeQuery`

`apiProxy` creates the query config expected by `makeQuery` from an API query
path. It provides:

- The cache key.
- The query function.
- The API input and output types.

Use it instead of manually repeating a key and wrapping an API query in a
closure.

## Query Without Input

Pass a query without input directly to `makeQuery`:

```ts
import { apiProxy } from "../api/trpc-api.ts";
import { makeQuery } from "../lib/mobx-query-lite/make-query.ts";

class UserStore {
  activePlanQuery = makeQuery(apiProxy.activePlan.query);
}
```

`apiProxy.activePlan.query` is a config factory. When `makeQuery` calls it, it
returns:

```ts
{
  key: "activePlan",
  query: api.activePlan.query,
}
```

Nested API paths become dot-separated keys:

```ts
makeQuery(apiProxy.cardInputMode.list.query);
// key: "cardInputMode.list"
```

## Query With Fixed Input

Call the proxy query with its input and pass the resulting config to
`makeQuery`:

```ts
export const weekHeatmapQuery = makeQuery(
  apiProxy.weekHeatmap.query({ timeZone: getTz() }),
  { staleTime: 0 },
);
```

The proxy binds the input to the query function:

```ts
const config = apiProxy.weekHeatmap.query({ timeZone: "Asia/Bangkok" });

// Conceptually:
// {
//   key: 'weekHeatmap:{"timeZone":"Asia/Bangkok"}',
//   query: () => api.weekHeatmap.query({ timeZone: "Asia/Bangkok" }),
// }
```

Another fixed-input example:

```ts
class UserStatisticsStore {
  userStatisticsQuery = makeQuery(
    apiProxy.myStatistics.query({ timeZone: getTz() }),
  );
}
```

Use this form when the input stays fixed for the lifetime of the query.

## Query With Observable Input

Pass a config factory to `makeQuery` when the query input reads MobX state:

```ts
export class CardStatsStore {
  filters = {
    period: new TextField<AdminCardStatsIntervalType>("month"),
  };

  request = makeQuery(() => {
    const period = this.filters.period.value;

    return apiProxy.adminAtGlanceCardStats.query({
      interval_type: period,
      fn_type: this.statisticFn,
    });
  });

  constructor(private statisticFn: AdminCardStatsFnType) {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
```

The function passed to `makeQuery` reads `period`. When `period` changes,
`makeQuery` asks `apiProxy` for a new config and switches to the cache entry for
the new input.

Switching back to an earlier input reuses the data cached for that input.

## Component-Local Query

Create a component-local query once with a lazy `useState` initializer:

```tsx
export function UsersTopList(props: Props) {
  const { fn } = props;
  const [query] = useState(() =>
    makeQuery(apiProxy.adminTopUsers.query({ fn })),
  );

  if (!query.data) {
    return <FullScreenLoader />;
  }

  return <SimpleTable data={query.data} />;
}
```

Use this form when the component instance owns one fixed input. If the input
must change while the component remains mounted, put it in a MobX store and use
the observable-input form.

## Generated Cache Keys

For queries without input, the key is the API path:

```ts
apiProxy.plans.query().key;
// "plans"
```

For queries with input, the serialized input is added to the path:

```ts
apiProxy.deck.deckWithCards.query({ deckId: 1 }).key;
// 'deck.deckWithCards:{"deckId":1}'

apiProxy.deck.deckWithCards.query({ deckId: 2 }).key;
// 'deck.deckWithCards:{"deckId":2}'
```

Object keys are sorted during serialization. Equivalent input objects produce
the same cache key even when their properties were inserted in a different
order.

Queries with the same generated key share the same query state. Queries with
different inputs cannot overwrite each other's cached data.

Do not provide an additional handwritten key when using `apiProxy`.

## Choosing the Form

| Query shape | Usage |
| --- | --- |
| No input | `makeQuery(apiProxy.path.query)` |
| Fixed input | `makeQuery(apiProxy.path.query(input))` |
| Observable input | `makeQuery(() => apiProxy.path.query(input))` |

## When to Keep a Handwritten Config

`apiProxy` is for a direct API query whose result is returned unchanged. Keep a
handwritten `{ key, query }` config when the query function contains additional
behavior around the request.

`makeInfiniteQuery` also keeps its handwritten config because it must pass a
new cursor to the API for every page.

Mutations continue to use `makeMutation` with the API mutation function.
