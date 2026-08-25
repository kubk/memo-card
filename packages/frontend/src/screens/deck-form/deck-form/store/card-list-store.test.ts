import { beforeEach, describe, expect, it, vi } from "vitest";
import { inMemoryCache } from "../../../../lib/mobx-query-lite/cache.ts";
import { queryRegistry } from "../../../../lib/mobx-query-lite/make-query.ts";
import { deckDetailsStore } from "../../../../store/deck-details-store.ts";
import { CardListStore } from "./card-list-store.ts";

const mocks = vi.hoisted(() => ({
  isDeckOwner: vi.fn(() => true),
  push: vi.fn(),
  replace: vi.fn(),
  screen: {
    type: "cardList",
    deckId: 42,
  } as {
    type: "cardList" | "cardListPreview";
    deckId: number;
    sortBy?: "createdAt" | "frontAlpha" | "backAlpha";
    sortDirection?: "asc" | "desc";
    searchText?: string;
  },
}));

vi.mock("../../../../api/trpc-api.ts", () => ({
  api: {
    card: {
      createMissingReverse: { mutate: vi.fn() },
      deleteMany: { mutate: vi.fn() },
      moveToOtherDeck: { mutate: vi.fn() },
    },
    deck: {
      deckWithCards: { query: vi.fn() },
    },
  },
}));

vi.mock("../../../../store/deck-list-store.ts", () => ({
  deckListStore: {
    isDeckOwner: mocks.isDeckOwner,
    deckIdsOwnedByMe: () => [],
    myDeckItems: [],
    replaceDeck: vi.fn(),
    updateCardsToReview: vi.fn(),
  },
}));

vi.mock("../../../../store/user-store.ts", () => ({
  userStore: { myId: 1 },
}));

vi.mock("../../../../store/screen-store.ts", () => ({
  screenStore: {
    get screen() {
      return mocks.screen;
    },
    push: mocks.push,
    replace: mocks.replace,
  },
}));

vi.mock("../../../../lib/platform/platform.ts", () => ({
  platform: { haptic: vi.fn() },
}));

vi.mock("../../../../lib/platform/show-confirm.ts", () => ({
  showConfirm: vi.fn(),
}));

vi.mock("../../../../store/app-loader-store.ts", () => ({
  appLoaderStore: {
    enable: vi.fn(),
    disable: vi.fn(),
  },
}));

vi.mock("../../../shared/snackbar/snackbar.tsx", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
}));

vi.mock("../../../../translations/t.ts", () => ({
  t: (key: string) => key,
}));

const createDeck = (cards: Array<{ id: number; front: string }>) => ({
  id: 42,
  name: "Travel English",
  authorId: 1,
  description: null,
  shareId: "travel",
  isPublic: true,
  speakLocale: null,
  speakField: null,
  reverseCards: false,
  deckCards: cards.map(({ id, front }, index) => ({
    id,
    createdAt: `2026-01-0${index + 1}T00:00:00.000Z`,
    deckId: 42,
    front,
    back: `${front} back`,
    example: null,
    answerType: "remember" as const,
    answers: null,
    options: null,
  })),
});

describe("CardListStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isDeckOwner.mockReturnValue(true);
    queryRegistry.clear();
    inMemoryCache.clear();
    mocks.screen = {
      type: "cardList",
      deckId: 42,
    };
  });

  it("reads cards from the shared deck query without taking a snapshot", () => {
    deckDetailsStore.setDeck(
      createDeck([
        { id: 1, front: "Airport" },
        { id: 2, front: "Hotel" },
      ]),
    );
    const store = new CardListStore();

    expect(store.filteredCards.map((card) => card.id)).toEqual([2, 1]);

    deckDetailsStore.setDeck(createDeck([{ id: 3, front: "Train" }]));

    expect(store.filteredCards.map((card) => card.id)).toEqual([3]);
  });

  it("ignores whitespace around a search phrase", () => {
    mocks.screen.searchText = " play ";
    deckDetailsStore.setDeck(
      createDeck([
        { id: 1, front: "to play" },
        { id: 2, front: "to call" },
      ]),
    );
    const store = new CardListStore();

    expect(store.filteredCards.map((card) => card.id)).toEqual([1]);
  });

  it("preserves whitespace inside a search phrase", () => {
    mocks.screen.searchText = "to cal";
    deckDetailsStore.setDeck(
      createDeck([
        { id: 1, front: "tocal" },
        { id: 2, front: "to call" },
      ]),
    );
    const store = new CardListStore();

    expect(store.filteredCards.map((card) => card.id)).toEqual([2]);
  });

  it("derives edit behavior from authorship", () => {
    deckDetailsStore.setDeck(createDeck([{ id: 1, front: "Airport" }]));
    const store = new CardListStore();

    store.openCard(1);

    expect(mocks.push).toHaveBeenCalledWith({
      type: "deckForm",
      deckId: 42,
      cardId: 1,
      sortBy: "createdAt",
      sortDirection: "desc",
      searchText: undefined,
    });

    mocks.isDeckOwner.mockReturnValue(false);
    store.openCard(1);

    expect(mocks.push).toHaveBeenLastCalledWith({
      type: "cardPreviewId",
      deckId: 42,
      cardId: 1,
    });
  });
});
