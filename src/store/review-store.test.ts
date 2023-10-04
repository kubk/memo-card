import { afterEach, describe, expect, it, vi } from "vitest";
import { CardState } from "./card-form-store.ts";
import { ReviewStore } from "./review-store.ts";
import { DeckCardDbType } from "../../functions/db/deck/decks-with-cards-schema.ts";

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

vi.mock("../api/api.ts", () => {
  return {
    reviewCardsRequest: () => {},
    myInfoRequest: () => {},
  };
});

vi.mock("./deck-list-store.ts", () => {
  return {
    deckListStore: {
      load: () => {},
    }
  }
})

describe("card form store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("basic", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(deckCardsMock);
    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.cardsToReview).toMatchInlineSnapshot(`
      [
        CardFormStore {
          "back": "Время",
          "front": "time",
          "id": 3,
          "isOpened": false,
          "state": undefined,
        },
        CardFormStore {
          "back": "Год",
          "front": "year",
          "id": 4,
          "isOpened": false,
          "state": undefined,
        },
        CardFormStore {
          "back": "Дорога",
          "front": "way",
          "id": 5,
          "isOpened": false,
          "state": undefined,
        },
      ]
    `);

    reviewStore.open();
    expect(reviewStore.currentCard?.isOpened).toBeTruthy();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.cardsToReview).toMatchInlineSnapshot(`
      [
        CardFormStore {
          "back": "Год",
          "front": "year",
          "id": 4,
          "isOpened": false,
          "state": undefined,
        },
        CardFormStore {
          "back": "Дорога",
          "front": "way",
          "id": 5,
          "isOpened": false,
          "state": undefined,
        },
      ]
    `);
    expect(reviewStore.currentCard?.id).toBe(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.cardsToReview).toMatchInlineSnapshot(`
      [
        CardFormStore {
          "back": "Дорога",
          "front": "way",
          "id": 5,
          "isOpened": false,
          "state": undefined,
        },
        CardFormStore {
          "back": "Год",
          "front": "year",
          "id": 4,
          "isOpened": false,
          "state": "forget",
        },
      ]
    `);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.cardsToReview).toHaveLength(1);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    expect(reviewStore.isFinished).toBeTruthy();

    expect(reviewStore.result.forgotIds).toEqual([4]);
    expect(reviewStore.result.rememberIds).toEqual([3, 5]);
  });

  it("current next", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(deckCardsMock);
    expect(reviewStore.isFinished).toBeFalsy();

    expect(reviewStore.currentCard?.id).toEqual(3);
    expect(reviewStore.nextCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.currentCard?.id).toEqual(4);
    expect(reviewStore.nextCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    expect(reviewStore.currentCard?.id).toEqual(5);
    expect(reviewStore.nextCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.currentCard?.id).toEqual(4);
    expect(reviewStore.nextCard).toBeFalsy();

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    expect(reviewStore.currentCard?.id).toEqual(4);
    expect(reviewStore.nextCard).toBeFalsy();

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.currentCard).toBeFalsy();
    expect(reviewStore.nextCard).toBeFalsy();
  });
});
