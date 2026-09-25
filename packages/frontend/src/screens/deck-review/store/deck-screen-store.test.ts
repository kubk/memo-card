import { beforeEach, describe, expect, it, vi } from "vitest";
import { when } from "mobx";
import { inMemoryCache } from "../../../lib/mobx-query-lite/cache.ts";
import { queryRegistry } from "../../../lib/mobx-query-lite/make-query.ts";
import { deckDetailsStore } from "../../../store/deck-details-store.ts";
import { DeckScreenStore } from "./deck-screen-store.ts";

const mocks = vi.hoisted(() => ({
  deckWithCards: vi.fn(),
  addDeckToMine: vi.fn(),
  isDeckOwner: vi.fn(
    (deck: { authorId: number | null }) => deck.authorId === 1,
  ),
  push: vi.fn(),
  myDecks: [] as unknown[],
  publicDecks: [] as unknown[],
  screen: { type: "main" } as unknown,
}));

vi.mock("../../../api/trpc-api.ts", () => ({
  api: {
    deck: {
      deckWithCards: { query: mocks.deckWithCards },
    },
  },
}));

vi.mock("../../../store/deck-list-store.ts", () => ({
  deckListStore: {
    get myDecks() {
      return mocks.myDecks;
    },
    get publicDecks() {
      return mocks.publicDecks;
    },
    addDeckToMine: mocks.addDeckToMine,
    isDeckOwner: mocks.isDeckOwner,
  },
}));

vi.mock("../../../store/user-store.ts", () => ({
  userStore: { myId: 1 },
}));

vi.mock("../../../store/screen-store.ts", () => ({
  screenStore: {
    get screen() {
      return mocks.screen;
    },
    push: mocks.push,
  },
}));

const publicDeck = {
  id: 42,
  name: "Travel English",
  authorId: 2,
  description: "Airport and hotel phrases",
  shareId: "travel",
  isPublic: true,
  speakLocale: null,
  speakField: null,
  deckCards: [],
  deckCategory: { name: "Travel", logo: "🇬🇧" },
};

const completeDeck = {
  ...publicDeck,
  createdAt: "2026-01-01T00:00:00.000Z",
  availableIn: "en",
  categoryId: null,
  deckCategory: undefined,
  deckCards: [
    {
      id: 1,
      createdAt: "2026-01-01T00:00:00.000Z",
      deckId: 42,
      front: "Airport",
      back: "Аэропорт",
      example: null,
      answerType: "remember" as const,
      answers: null,
      options: null,
    },
  ],
};

describe("DeckScreenStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.myDecks.length = 0;
    mocks.publicDecks.length = 0;
    mocks.screen = { type: "main" };
    queryRegistry.clear();
    inMemoryCache.clear();
  });

  it("loads catalog details without storing a deck in the route", async () => {
    mocks.deckWithCards.mockResolvedValue(completeDeck);
    const store = new DeckScreenStore(publicDeck.id);

    expect(store.deck).toBeNull();
    expect(store.isInitialLoading).toBe(true);

    await when(() => store.deck?.deckCards.length === 1);

    expect(store.deck?.deckCards).toHaveLength(1);
    expect(store.isInitialLoading).toBe(false);
  });

  it("hydrates an unowned deck without mutating its public-list category", async () => {
    mocks.publicDecks.push(publicDeck);
    mocks.deckWithCards.mockResolvedValue(completeDeck);
    const store = new DeckScreenStore(publicDeck.id);

    expect(store.deck?.deckCategory).toEqual({
      name: "Travel",
      logo: "🇬🇧",
    });
    expect(store.isInitialLoading).toBe(true);

    await when(() => store.deck?.deckCards.length === 1);

    expect(store.deck?.deckCards).toHaveLength(1);
    expect(store.isInitialLoading).toBe(false);
    expect(publicDeck.deckCategory).toEqual({
      name: "Travel",
      logo: "🇬🇧",
    });
  });

  it("reuses complete details when the screen store is recreated", async () => {
    mocks.publicDecks.push(publicDeck);
    mocks.deckWithCards.mockResolvedValue(completeDeck);

    const firstStore = new DeckScreenStore(publicDeck.id);
    await when(() => firstStore.deck?.deckCards.length === 1);

    const secondStore = new DeckScreenStore(publicDeck.id);
    expect(secondStore.deck?.deckCards).toHaveLength(1);
    expect(secondStore.isInitialLoading).toBe(false);
    expect(mocks.deckWithCards).toHaveBeenCalledTimes(1);
  });

  it("uses owned deck data without starting the detail query", async () => {
    mocks.myDecks.push({
      ...publicDeck,
      cardsToReview: [],
    });
    const store = new DeckScreenStore(publicDeck.id);

    expect(store.deck?.id).toBe(publicDeck.id);
    expect(store.isInitialLoading).toBe(false);
    await Promise.resolve();
    expect(mocks.deckWithCards).not.toHaveBeenCalled();
  });

  it.each([
    {
      entryPoint: "My decks",
      authorId: 1,
      expectedRouteType: "cardList",
    },
    {
      entryPoint: "My decks",
      authorId: 2,
      expectedRouteType: "cardListPreview",
    },
    {
      entryPoint: "public catalog",
      authorId: 1,
      expectedRouteType: "cardList",
    },
    {
      entryPoint: "public catalog",
      authorId: 2,
      expectedRouteType: "cardListPreview",
    },
  ] as const)(
    "opens $expectedRouteType for a deck with author $authorId from $entryPoint",
    ({ entryPoint, authorId, expectedRouteType }) => {
      const deck = {
        ...completeDeck,
        authorId,
        cardsToReview: [],
      };

      if (entryPoint === "My decks") {
        mocks.myDecks.push(deck);
      } else {
        deckDetailsStore.setDeck(deck);
      }

      const store = new DeckScreenStore(deck.id);
      store.openCardList();

      expect(mocks.push).toHaveBeenCalledWith({
        type: expectedRouteType,
        deckId: deck.id,
      });
    },
  );

  it.each([
    {
      authorId: 1,
      expectedRoute: { type: "deckForm", deckId: 42, cardId: 1 },
    },
    {
      authorId: 2,
      expectedRoute: { type: "cardPreviewId", cardId: 1, deckId: 42 },
    },
  ] as const)(
    "opens an editable or read-only card for author $authorId",
    ({ authorId, expectedRoute }) => {
      deckDetailsStore.setDeck({
        ...completeDeck,
        authorId,
      });

      const store = new DeckScreenStore(completeDeck.id);
      store.openCard(1);

      expect(mocks.push).toHaveBeenCalledWith(expectedRoute);
    },
  );
});
