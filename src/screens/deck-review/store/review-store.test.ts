import { afterEach, describe, expect, it, vi } from "vitest";
import { CardState, CardUnderReviewStore } from "./card-under-review-store.ts";
import { ReviewStore } from "./review-store.ts";
import {
  DeckCardDbTypeWithType,
  DeckWithCardsWithReviewType,
} from "../../../store/deck-list-store.ts";

const deckCardsMock: DeckCardDbTypeWithType[] = [
  {
    id: 3,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "time",
    back: "Время",
    type: "repeat",
  },
  {
    id: 4,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "year",
    back: "Год",
    type: "repeat",
  },
  {
    id: 5,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "way",
    back: "Дорога",
    type: "repeat",
  },
];

const deckMock: DeckWithCardsWithReviewType = {
  id: 1,
  name: "English",
  description: "English words",
  deck_card: deckCardsMock,
  cardsToReview: deckCardsMock,
  speak_field: null,
  speak_locale: null,
  created_at: "2023-10-06T02:13:20.985Z",
  author_id: 1,
  share_id: "share_id_mock2",
  is_public: false,
  available_in: null,
  deck_category: null,
  category_id: null,
};

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
    },
  };
});

vi.mock("../lib/voice-playback/speak.ts", async () => {
  return {
    speak: () => {},
  };
});

const cardToSnapshot = (card: CardUnderReviewStore) => ({
  back: card.back,
  deckName: card.deckName,
  example: card.example,
  front: card.front,
  id: card.id,
  isOpened: card.isOpened,
  state: card.state,
});

describe("card form store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("basic", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(deckMock);
    expect(reviewStore.isFinished).toBeFalsy();

    expect(reviewStore.cardsToReview.map(cardToSnapshot))
      .toMatchInlineSnapshot(`
      [
        {
          "back": "Время",
          "deckName": "English",
          "example": null,
          "front": "time",
          "id": 3,
          "isOpened": false,
          "state": undefined,
        },
        {
          "back": "Год",
          "deckName": "English",
          "example": null,
          "front": "year",
          "id": 4,
          "isOpened": false,
          "state": undefined,
        },
        {
          "back": "Дорога",
          "deckName": "English",
          "example": null,
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
    expect(reviewStore.cardsToReview.map(cardToSnapshot))
      .toMatchInlineSnapshot(`
      [
        {
          "back": "Год",
          "deckName": "English",
          "example": null,
          "front": "year",
          "id": 4,
          "isOpened": false,
          "state": undefined,
        },
        {
          "back": "Дорога",
          "deckName": "English",
          "example": null,
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
    expect(reviewStore.cardsToReview.map(cardToSnapshot))
      .toMatchInlineSnapshot(`
      [
        {
          "back": "Дорога",
          "deckName": "English",
          "example": null,
          "front": "way",
          "id": 5,
          "isOpened": false,
          "state": undefined,
        },
        {
          "back": "Год",
          "deckName": "English",
          "example": null,
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
    reviewStore.startDeckReview(deckMock);
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

  it("hit wrong many times", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(deckMock);
    expect(reviewStore.isFinished).toBeFalsy();

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    expect(reviewStore.result.forgotIds).toHaveLength(3);
    expect(reviewStore.result.rememberIds).toHaveLength(0);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.result.forgotIds).toHaveLength(3);
    expect(reviewStore.result.rememberIds).toHaveLength(0);
  });
});
