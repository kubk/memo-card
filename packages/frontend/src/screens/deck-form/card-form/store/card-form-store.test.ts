import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CardFormStore } from "./card-form-store.ts";
import { DeckCardDbType } from "api";
import { type DeckWithCardsWithReviewType } from "../../../../store/deck-list-store.ts";
import { isFormValid } from "mobx-form-lite";
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
    cardAdd: vi.fn(() =>
      Promise.resolve({
        createdCards: [{ id: 999, front: "test", back: "test" }],
        ...createMockDeckResponse(),
      }),
    ),
    cardUpdate: vi.fn(() => Promise.resolve(createMockDeckResponse())),
    cardDelete: vi.fn(() => Promise.resolve(createMockDeckResponse())),
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
      replaceDeck: vi.fn(),
      updateCardsToReview: vi.fn(),
      searchDeckById: (id: number) => {
        return myDecks.find((deck) => deck.id === id);
      },
      myDecks: myDecks,
    },
  };
});

vi.mock("../../../../store/app-loader-store.ts", () => {
  return {
    appLoaderStore: {
      isAppLoading: false,
    },
  };
});

vi.mock(import("../../../../lib/platform/show-confirm.ts"), () =>
  import("../../../../lib/platform/show-confirm.mock.ts").then((m) => m.mock()),
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
        add: { mutate: mocks.cardAdd },
        update: { mutate: mocks.cardUpdate },
        delete: { mutate: mocks.cardDelete },
      },
    },
  };
});

vi.mock("../../../../store/user-store.ts", () => {
  return {
    userStore: {
      isPaid: false,
    },
  };
});

vi.mock(import("../../../../lib/voice/generate-voice-for-new-cards.ts"), () => {
  return {
    generateVoiceForNewCards: vi.fn(),
  };
});

describe("card form store", () => {
  beforeEach(() => {
    mockScreenStore.reset({
      type: "deckForm",
      deckId: 1,
      cardId: "new",
      sortBy: "createdAt",
      sortDirection: "desc",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates new card", async () => {
    const store = new CardFormStore();
    store.loadForm();

    assert(store.cardForm);
    expect(store.cardFormType).toBe("new");
    expect(isFormValid(store.cardForm)).toBeFalsy();

    store.cardForm.front.onChange("new front");
    store.cardForm.back.onChange("new back");

    expect(isFormValid(store.cardForm)).toBeTruthy();

    await store.onSaveCard();

    expect(mocks.cardAdd).toHaveBeenCalledTimes(1);
    // @ts-expect-error - mock typing issue
    expect(mocks.cardAdd.mock.lastCall?.[0]).toMatchInlineSnapshot(`
      {
        "card": {
          "answerType": "remember",
          "answers": [],
          "back": "new back",
          "example": null,
          "front": "new front",
        },
        "deckId": 1,
      }
    `);
  });

  it("edits existing card", async () => {
    mockScreenStore.reset({
      type: "deckForm",
      deckId: 1,
      cardId: 3,
      sortBy: "createdAt",
      sortDirection: "desc",
    });

    const store = new CardFormStore();
    store.loadForm();

    assert(store.cardForm);
    expect(store.cardFormType).toBe("edit");
    expect(store.cardForm.id).toBe(3);
    expect(store.cardForm.front.value).toBe("time");
    expect(store.cardForm.back.value).toBe("Время");

    store.cardForm.front.onChange("edited front");
    store.cardForm.back.onChange("edited back");

    await store.onSaveCard();

    expect(mocks.cardUpdate).toHaveBeenCalledTimes(1);
    // @ts-expect-error - mock typing issue
    expect(mocks.cardUpdate.mock.lastCall?.[0]).toMatchInlineSnapshot(`
      {
        "answerType": "remember",
        "answers": [],
        "back": "edited back",
        "example": null,
        "front": "edited front",
        "id": 3,
        "options": null,
      }
    `);
  });

  it("navigates between cards", () => {
    mockScreenStore.reset({
      type: "deckForm",
      deckId: 1,
      cardId: 5,
      sortBy: "createdAt",
      sortDirection: "desc",
    });

    const store = new CardFormStore();
    store.loadForm();

    assert(store.cardForm);
    expect(store.cardForm.id).toBe(5);
    expect(store.isPreviousCardVisible).toBeFalsy();
    expect(store.isNextCardVisible).toBeTruthy();

    store.onNextCard();
    store.loadForm();

    expect(store.cardForm?.id).toBe(4);
    expect(store.isPreviousCardVisible).toBeTruthy();
    expect(store.isNextCardVisible).toBeTruthy();

    store.onNextCard();
    store.loadForm();

    expect(store.cardForm?.id).toBe(3);
    expect(store.isPreviousCardVisible).toBeTruthy();
    expect(store.isNextCardVisible).toBeFalsy();

    store.onPreviousCard();
    store.loadForm();

    expect(store.cardForm?.id).toBe(4);
  });

  it("editing card form doesn't affect the source array", () => {
    mockScreenStore.reset({
      type: "deckForm",
      deckId: 1,
      cardId: 3,
      sortBy: "createdAt",
      sortDirection: "desc",
    });

    const store = new CardFormStore();
    store.loadForm();

    assert(store.cardForm);

    const originalCard = store.filteredCards.find((c) => c.id === 3);
    const originalFront = originalCard?.front.value;

    store.cardForm.front.onChange("new value");

    expect(originalCard?.front.value).toBe(originalFront);
    expect(store.cardForm.front.value).toBe("new value");
  });
});
