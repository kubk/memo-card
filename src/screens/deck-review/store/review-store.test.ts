import { afterEach, describe, expect, it, vi } from "vitest";
import { CardState, CardUnderReviewStore } from "./card-under-review-store.ts";
import { ReviewStore } from "./review-store.ts";
import {
  DeckCardDbTypeWithType,
  DeckWithCardsWithReviewType,
} from "../../../store/deck-list-store.ts";

vi.mock("mobx-persist-store", () => {
  return {
    makePersistable: () => {},
  };
});

const createDeckWithCards = (cards: DeckCardDbTypeWithType[]) => {
  const deckMock: DeckWithCardsWithReviewType = {
    id: 1,
    name: "English",
    description: "English words",
    deck_card: cards,
    cardsToReview: cards,
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
  return deckMock;
};

const repeatCardsMock: DeckCardDbTypeWithType[] = [
  {
    id: 3,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "time",
    back: "Время",
    type: "repeat",
    answer_type: "remember",
    answers: null,
    options: null,
  },
  {
    id: 4,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "year",
    back: "Год",
    type: "repeat",
    answer_type: "remember",
    answers: null,
    options: null,
  },
  {
    id: 5,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "way",
    back: "Дорога",
    type: "repeat",
    answer_type: "remember",
    answers: null,
    options: null,
  },
  {
    id: 6,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "card 4",
    back: "card 4",
    type: "repeat",
    answer_type: "remember",
    answers: null,
    options: null,
  },
];

const newCardsMock: DeckCardDbTypeWithType[] = [
  {
    id: 3,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "time",
    back: "Время",
    type: "new",
    answer_type: "remember",
    answers: null,
    options: null,
  },
  {
    id: 4,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "year",
    back: "Год",
    type: "new",
    answer_type: "remember",
    answers: null,
    options: null,
  },
  {
    id: 5,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "way",
    back: "Дорога",
    type: "new",
    answer_type: "remember",
    answers: null,
    options: null,
  },
  {
    id: 6,
    deck_id: 1,
    created_at: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "card 4",
    back: "card 4",
    type: "new",
    answer_type: "remember",
    answers: null,
    options: null,
  },
];

vi.mock("../lib/telegram/storage-adapter.ts", () => {
  return {
    storageAdapter: {},
  };
});

vi.mock("../../../api/api.ts", () => {
  return {
    reviewCardsRequest: () => {},
    myInfoRequest: () => {},
  };
});

vi.mock("./../store/deck-list-store.ts", () => {
  return {
    deckListStore: {
      load: () => {},
    },
  };
});

vi.mock("../../../lib/voice-playback/speak.ts", async () => {
  return {
    speak: () => {},
  };
});

vi.mock("../../../lib/telegram/haptics.ts", () => {
  return {
    hapticImpact: () => {},
    hapticNotification: () => {},
  };
});

vi.mock("../../../store/user-store.ts", () => {
  return {
    userStore: {},
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
    reviewStore.startDeckReview(createDeckWithCards(repeatCardsMock));
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
          {
            "back": "card 4",
            "deckName": "English",
            "example": null,
            "front": "card 4",
            "id": 6,
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
          {
            "back": "card 4",
            "deckName": "English",
            "example": null,
            "front": "card 4",
            "id": 6,
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
            "back": "card 4",
            "deckName": "English",
            "example": null,
            "front": "card 4",
            "id": 6,
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
    expect(reviewStore.cardsToReview).toHaveLength(2);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    expect(reviewStore.isFinished).toBeTruthy();

    expect(reviewStore.result.forgotIds).toEqual([4]);
    expect(reviewStore.result.rememberIds).toEqual([3, 5, 6]);
  });

  it("current next", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(createDeckWithCards(repeatCardsMock));
    expect(reviewStore.isFinished).toBeFalsy();

    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.currentCard?.id).toEqual(6);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);

    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.currentCard).toBeFalsy();
  });

  it("hit wrong many times", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(createDeckWithCards(repeatCardsMock));
    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(6);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(5);

    expect(reviewStore.result.forgotIds).toHaveLength(4);
    expect(reviewStore.result.rememberIds).toHaveLength(0);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.result.forgotIds).toHaveLength(4);
    expect(reviewStore.result.rememberIds).toHaveLength(0);
    expect(reviewStore.currentCard?.id).toEqual(4);
  });

  it("hit wrong many times - prioritize forgotten new cards", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(createDeckWithCards(newCardsMock));

    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState(CardState.Forget);
    expect(reviewStore.currentCard?.id).toEqual(3);

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
    expect(reviewStore.currentCard?.id).toEqual(6);
  });
});
