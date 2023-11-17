import { afterEach, expect, describe, it, vi } from "vitest";
import { DeckFormStore } from "./deck-form-store.ts";
import { DeckCardDbType } from "../../functions/db/deck/decks-with-cards-schema.ts";
import { type DeckWithCardsWithReviewType } from "./deck-list-store.ts";
import { assert } from "../lib/typescript/assert.ts";

vi.mock("./screen-store", () => {
  return {
    screenStore: {
      screen: {
        type: "deckForm",
        deckFormId: 1,
      }
    },
  };
});

vi.mock("./deck-list-store.ts", () => {
  const deckCardsMock: DeckCardDbType[] = [
    {
      id: 3,
      deck_id: 1,
      created_at: "2023-10-06T02:13:20.985Z",
      example: null,
      front: "time",
      back: "Время",
    },
    {
      id: 4,
      deck_id: 1,
      created_at: "2023-10-06T02:13:20.985Z",
      example: null,
      front: "year",
      back: "Год",
    },
    {
      id: 5,
      deck_id: 1,
      created_at: "2023-10-06T02:13:20.985Z",
      example: null,
      front: "way",
      back: "Дорога",
    },
  ];

  return {
    deckListStore: {
      myDecks: [
        {
          id: 1,
          cardsToReview: deckCardsMock.slice(0, 2),
          share_id: null,
          deck_card: deckCardsMock,
          name: "Test",
        },
      ] as DeckWithCardsWithReviewType[],
    },
  };
});

vi.mock("../lib/telegram/show-confirm.ts", () => {
  return {
    showConfirm: () => {},
  };
});

vi.mock("../lib/telegram/show-alert.ts", () => {
  return {
    showAlert: () => {},
  };
});

vi.mock("../api/api.ts", () => {
  return {
    upsertDeckRequest: () => {},
  };
});

describe("deck form store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("bug with card amount", () => {
    const store = new DeckFormStore();
    store.loadForm();
    assert(store.form);
    expect(store.form.cards).toHaveLength(3);

    store.openNewCardForm();
    store.quitCardForm();

    expect(store.form.cards).toHaveLength(3);

    store.editCardForm(2);
    store.quitCardForm();

    expect(store.form.cards).toHaveLength(3);
  });
});
