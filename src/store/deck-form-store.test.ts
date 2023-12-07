import { afterEach, describe, expect, it, vi } from "vitest";
import { DeckFormStore } from "./deck-form-store.ts";
import { DeckCardDbType } from "../../functions/db/deck/decks-with-cards-schema.ts";
import { type DeckWithCardsWithReviewType } from "./deck-list-store.ts";
import { assert } from "../lib/typescript/assert.ts";
import {
  UpsertDeckRequest,
  UpsertDeckResponse,
} from "../../functions/upsert-deck.ts";
import { isFormValid } from "../lib/mobx-form/form-has-error.ts";

const mapUpsertDeckRequestToResponse = (
  input: UpsertDeckRequest,
): UpsertDeckResponse => ({
  id: input.id || 9999,
  description: input.description ?? null,
  created_at: new Date().toISOString(),
  name: input.title,
  author_id: 9999,
  share_id: "share_id_mock",
  is_public: false,
  speak_locale: null,
  speak_field: null,
  deck_card: input.cards.map((card) => {
    assert(input.id);
    return {
      id: card.id || 9999,
      deck_id: input.id,
      created_at: new Date().toISOString(),
      example: card.example ?? null,
      front: card.front,
      back: card.back,
    };
  }),
});

const mocks = vi.hoisted(() => {
  return {
    upsertDeckRequest: vi.fn(
      (input: UpsertDeckRequest): Promise<UpsertDeckResponse> =>
        Promise.resolve(mapUpsertDeckRequestToResponse(input)),
    ),
  };
});

vi.mock("./screen-store", () => {
  return {
    screenStore: {
      screen: {
        type: "deckForm",
        deckId: 1,
      },
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
    upsertDeckRequest: mocks.upsertDeckRequest,
  };
});

describe("deck form store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("add 1 card, save", () => {
    const store = new DeckFormStore();
    store.loadForm();
    assert(store.form);
    expect(store.form.cards).toHaveLength(3);

    store.onDeckSave();

    expect(mocks.upsertDeckRequest.mock.calls).toHaveLength(1);
    expect(mocks.upsertDeckRequest.mock.calls[0][0].cards).toHaveLength(0);

    store.openNewCardForm();

    expect(mocks.upsertDeckRequest.mock.calls).toHaveLength(1);

    store.editCardForm(3);
    assert(store.cardForm);

    expect(isFormValid(store.cardForm)).toBeFalsy();

    store.cardForm.front.onChange("1 (new)");
    store.cardForm.back.onChange("1 (new)");

    expect(isFormValid(store.cardForm)).toBeTruthy();

    store.onDeckSave();

    expect(mocks.upsertDeckRequest.mock.calls).toHaveLength(2);
    expect(mocks.upsertDeckRequest.mock.calls[1][0].cards)
      .toMatchInlineSnapshot(`
      [
        {
          "back": "1 (new)",
          "example": "",
          "front": "1 (new)",
          "id": undefined,
        },
      ]
    `);
  });

  it("edit 2 cards, add 1 new, save", () => {
    const store = new DeckFormStore();
    store.loadForm();
    assert(store.form);
    expect(store.form.cards).toHaveLength(3);

    store.editCardForm(0);
    assert(store.cardForm);

    store.cardForm.front.onChange("2 (edited)");
    store.cardForm.back.onChange("2 (edited)");

    store.editCardForm(1);
    store.cardForm.front.onChange("3 (edited)");
    store.cardForm.back.onChange("3 (edited)");

    store.openNewCardForm();
    store.editCardForm(3);

    store.cardForm.front.onChange("1 (new)");
    store.cardForm.back.onChange("1 (new)");

    store.onDeckSave();
    expect(mocks.upsertDeckRequest.mock.calls).toHaveLength(1);
    expect(mocks.upsertDeckRequest.mock.calls[0][0].cards)
      .toMatchInlineSnapshot(`
      [
        {
          "back": "1 (new)",
          "example": "",
          "front": "1 (new)",
          "id": undefined,
        },
        {
          "back": "2 (edited)",
          "example": "",
          "front": "2 (edited)",
          "id": 3,
        },
        {
          "back": "3 (edited)",
          "example": "",
          "front": "3 (edited)",
          "id": 4,
        },
      ]
    `);
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
