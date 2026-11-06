import type { Route } from "./route-types.ts";

export const cardSortByValues = [
  "createdAt",
  "frontAlpha",
  "backAlpha",
] as const;
export const cardSortDirectionValues = ["asc", "desc"] as const;

export type CardSortBy = (typeof cardSortByValues)[number];
export type CardSortDirection = (typeof cardSortDirectionValues)[number];

type CardQuery = {
  sortBy: CardSortBy;
  sortDirection: CardSortDirection;
  searchText: string;
};

type QueryableCard = {
  front: string;
  back: string;
  createdAt: string | null;
};

export function getCardQuery(route: Route): CardQuery {
  const params: Partial<CardQuery> =
    route.type === "deckForm" ||
    route.type === "cardList" ||
    route.type === "cardListPreview"
      ? route
      : {};

  return {
    sortBy: params.sortBy ?? "createdAt",
    sortDirection: params.sortDirection ?? "desc",
    searchText: params.searchText ?? "",
  };
}

export function toCardQueryParams(query: CardQuery) {
  return {
    sortBy: query.sortBy,
    sortDirection: query.sortDirection,
    searchText: query.searchText || undefined,
  };
}

export function queryCards<T>(
  cards: T[],
  query: CardQuery,
  toQueryable: (card: T) => QueryableCard,
): T[] {
  const searchText = query.searchText.trim().toLowerCase();
  const direction = query.sortDirection === "asc" ? 1 : -1;
  const getSortValue = (card: QueryableCard) => {
    switch (query.sortBy) {
      case "frontAlpha":
        return card.front.toLowerCase();
      case "backAlpha":
        return card.back.toLowerCase();
      case "createdAt":
        return card.createdAt ?? "";
      default:
        return query.sortBy satisfies never;
    }
  };

  return cards
    .map((card) => ({ card, queryable: toQueryable(card) }))
    .filter(
      ({ queryable }) =>
        !searchText ||
        queryable.front.toLowerCase().includes(searchText) ||
        queryable.back.toLowerCase().includes(searchText),
    )
    .sort(
      (a, b) =>
        direction *
        getSortValue(a.queryable).localeCompare(getSortValue(b.queryable)),
    )
    .map(({ card }) => card);
}
