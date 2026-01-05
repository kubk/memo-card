import { afterEach, describe, expect, it, vi } from "vitest";
import { CardFormType, DeckFormStore } from "./deck-form-store.ts";
import { DeckCardDbType } from "api";
import { type DeckWithCardsWithReviewType } from "../../../../store/deck-list-store.ts";
import { assert } from "api";

const mocks = vi.hoisted(() => {
  const createMockDeckResponse = () => ({
    deck: {
      id: 1,
      availableIn: null,
      description: null,
      createdAt: new Date().toISOString(),
      name: "Test",
      authorId: 9999,
      shareId: "share_id_mock",
      isPublic: false,
      speakLocale: null,
      speakField: null,
      speakAutoAi: false,
      reverseCards: false,
      deckCategory: null,
      categoryId: null,
      cardInputModeId: null,
      deckCards: [],
    },
    cardsToReview: [],
    folders: [],
  });

  return {
    deckUpdate: vi.fn(() => Promise.resolve(createMockDeckResponse())),
  };
});

import { mockScreenStore } from "../../../../store/screen-store.mock.ts";

vi.mock("../../../../store/screen-store.ts", async () => {
  const mock = await import("../../../../store/screen-store.mock.ts");
  return { screenStore: mock.mockScreenStore };
});

vi.mock("../../../../store/deck-list-store.ts", () => {
  const deckCardsMock: DeckCardDbType[] = [
    {
      id: 3,
      deckId: 1,
      createdAt: "2023-10-06T02:13:20.985Z",
      example: null,
      front: "time",
      back: "Время",
      answerType: "remember",
      answers: null,
      options: null,
    },
    {
      id: 4,
      deckId: 1,
      createdAt: "2023-10-06T02:14:20.985Z",
      example: null,
      front: "year",
      back: "Год",
      answerType: "remember",
      answers: null,
      options: null,
    },
    {
      id: 5,
      deckId: 1,
      createdAt: "2023-10-06T02:15:20.985Z",
      example: null,
      front: "way",
      back: "Дорога",
      answerType: "remember",
      answers: null,
      options: null,
    },
  ];

  const cardsToReview = deckCardsMock.slice(0, 2).map((card) => ({
    ...card,
    type: "new" as const,
    interval: 0.4,
    easeFactor: 2.5,
  }));

  const myDecks = [
    {
      id: 1,
      cardsToReview: cardsToReview,
      shareId: "share_id_mock",
      deckCards: deckCardsMock,
      name: "Test",
    },
  ] as DeckWithCardsWithReviewType[];

  return {
    deckListStore: {
      replaceDeck: () => {},
      updateFolders: () => {},
      updateCardsToReview: () => {},
      searchDeckById: (id: number) => {
        return myDecks.find((deck) => deck.id === id);
      },
      myDecks: myDecks,
    },
  };
});

vi.mock(import("../../../../lib/voice-playback/speak.ts"), () =>
  import("../../../../lib/voice-playback/speak.mock.ts").then((m) => m.mock()),
);

vi.mock(import("../../../../lib/platform/show-confirm.ts"), () =>
  import("../../../../lib/platform/show-confirm.mock.ts").then((m) => m.mock()),
);

vi.mock(import("../../../../lib/platform/show-alert.ts"), () =>
  import("../../../../lib/platform/show-alert.mock.ts").then((m) => m.mock()),
);

vi.mock(import("../../../shared/snackbar/snackbar.tsx"), () =>
  import("../../../shared/snackbar/snackbar.mock.tsx").then((m) => m.mock()),
);

vi.mock(import("../../../../translations/t.ts"), () =>
  import("../../../../translations/t.mock.ts").then((m) => m.mock()),
);

vi.mock("../../../../api/trpc-api.ts", () => {
  return {
    api: {
      card: {
        add: { mutate: vi.fn() },
        update: { mutate: vi.fn() },
        delete: { mutate: vi.fn() },
        deleteMany: { mutate: vi.fn() },
      },
      deck: {
        create: { mutate: vi.fn() },
        update: { mutate: mocks.deckUpdate },
      },
      activePlans: {
        query: vi.fn(),
      },
    },
  };
});

describe("deck form store", () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockScreenStore.reset({
      type: "deckForm",
      deckId: 1,
      sortBy: "createdAt",
      sortDirection: "desc",
    });
  });

  it("deck save only saves metadata", async () => {
    const store = new DeckFormStore();
    store.loadForm();
    assert(store.deckForm);
    expect(store.deckForm.cards).toHaveLength(3);

    store.deckForm.title.onChange("Updated Title");
    store.deckForm.description.onChange("Updated description");

    await store.onDeckSave();

    expect(mocks.deckUpdate).toHaveBeenCalledTimes(1);
    // @ts-expect-error - mock typing issue
    expect(mocks.deckUpdate.mock.lastCall?.[0]).toMatchInlineSnapshot(`
      {
        "description": "Updated description",
        "folderId": undefined,
        "id": 1,
        "reverseCards": undefined,
        "speakAutoAi": undefined,
        "speakField": undefined,
        "speakLocale": undefined,
        "title": "Updated Title",
      }
    `);
  });

  it("sorting - filtering cards", () => {
    const store = new DeckFormStore();
    store.loadForm();
    assert(store.deckForm);
    expect(store.deckForm.cards).toHaveLength(3);

    const cardToId = (card: CardFormType) => card.id;

    expect(store.filteredCards.map(cardToId)).toEqual([5, 4, 3]);

    store.setSortByIdAndDirection("createdAt", "asc");

    expect(store.filteredCards.map(cardToId)).toEqual([3, 4, 5]);

    store.setSortByIdAndDirection("frontAlpha", "asc");

    expect(store.filteredCards.map(cardToId)).toEqual([3, 5, 4]);

    store.setSortByIdAndDirection("frontAlpha", "desc");

    expect(store.filteredCards.map(cardToId)).toEqual([4, 5, 3]);
  });

  it("sorting - toggling direction & change sortBy field", () => {
    const store = new DeckFormStore();
    store.loadForm();

    store.setSortByIdAndDirection("createdAt", "asc");

    store.changeSort("createdAt");

    expect(store.cardFilterSortBy).toEqual("createdAt");
    expect(store.cardFilterSortDirection).toEqual("desc");

    store.changeSort("frontAlpha");

    expect(store.cardFilterSortBy).toEqual("frontAlpha");
    expect(store.cardFilterSortDirection).toEqual("desc");
  });

  it("editCardFormById navigates to card form", () => {
    const store = new DeckFormStore();
    store.loadForm();
    assert(store.deckForm);

    store.editCardFormById(3);

    expect(mockScreenStore.screen.type).toBe("deckForm");
    if (mockScreenStore.screen.type === "deckForm") {
      expect(mockScreenStore.screen.cardId).toBe(3);
    }
  });

  it("navigateToNewCard navigates to new card form", () => {
    const store = new DeckFormStore();
    store.loadForm();
    assert(store.deckForm);

    store.navigateToNewCard();

    expect(mockScreenStore.screen.type).toBe("deckForm");
    if (mockScreenStore.screen.type === "deckForm") {
      expect(mockScreenStore.screen.cardId).toBe("new");
    }
  });
});
