import { afterEach, describe, expect, it, vi } from "vitest";
import { CardState, CardUnderReviewStore } from "./card-under-review-store.ts";
import { ReviewStore } from "./review-store.ts";
import {
  DeckCardDbTypeWithType,
  DeckWithCardsWithReviewType,
} from "../../../store/deck-list-store.ts";
import { when } from "mobx";

vi.mock("mobx-persist-store", () => {
  return {
    makePersistable: () => {},
  };
});

vi.mock("../../../lib/platform/show-confirm.ts", () => {
  return {
    showAlert: () => {},
  };
});

vi.mock("../../../translations/t.ts", () => {
  return {
    t: (val: string) => val,
  };
});

const createDeckWithCards = (cards: DeckCardDbTypeWithType[]) => {
  const deckMock: DeckWithCardsWithReviewType = {
    id: 1,
    name: "English",
    description: "English words",
    deckCards: cards,
    cardsToReview: cards,
    speakField: null,
    speakLocale: null,
    createdAt: "2023-10-06T02:13:20.985Z",
    authorId: 1,
    shareId: "share_id_mock2",
    isPublic: false,
    availableIn: null,
    deckCategory: null,
    categoryId: null,
    cardInputModeId: null,
  };
  return deckMock;
};

const repeatCardsMock: DeckCardDbTypeWithType[] = [
  {
    id: 3,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "time",
    back: "Время",
    type: "repeat",
    answerType: "remember",
    answers: null,
    options: null,
  },
  {
    id: 4,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "year",
    back: "Год",
    type: "repeat",
    answerType: "remember",
    answers: null,
    options: null,
  },
  {
    id: 5,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "way",
    back: "Дорога",
    type: "repeat",
    answerType: "remember",
    answers: null,
    options: null,
  },
  {
    id: 6,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "card 4",
    back: "card 4",
    type: "repeat",
    answerType: "remember",
    answers: null,
    options: null,
  },
];

const newCardsMock: DeckCardDbTypeWithType[] = [
  {
    id: 3,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "time",
    back: "Время",
    type: "new",
    answerType: "remember",
    answers: null,
    options: null,
  },
  {
    id: 4,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "year",
    back: "Год",
    type: "new",
    answerType: "remember",
    answers: null,
    options: null,
  },
  {
    id: 5,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "way",
    back: "Дорога",
    type: "new",
    answerType: "remember",
    answers: null,
    options: null,
  },
  {
    id: 6,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front: "card 4",
    back: "card 4",
    type: "new",
    answerType: "remember",
    answers: null,
    options: null,
  },
];

vi.mock("../lib/platform/storage-adapter.ts", () => {
  return {
    storageAdapter: {},
  };
});

const reviewCardsReviewMock = vi.hoisted(() => vi.fn());

vi.mock("../../../api/trpc-api.ts", () => {
  return {
    api: {
      reviewCardsRequest: reviewCardsReviewMock,
      cardsReview: {
        mutate: reviewCardsReviewMock,
      },
      me: {
        features: {
          query: () => vi.fn(),
        },
      },
    },
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

vi.mock("../../../lib/platform/telegram/haptics.ts", () => {
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

vi.mock("../../shared/snackbar/snackbar.tsx", () => {
  return {
    notifyError: vi.fn(),
    notifySuccess: vi.fn(),
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

  it("test silent progress send", async () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(0);
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(
      createDeckWithCards([
        {
          id: 3,
          deckId: 1,
          createdAt: "2023-10-06T02:13:20.985Z",
          example: null,
          front: "time",
          back: "Время",
          type: "repeat",
          answerType: "remember",
          answers: null,
          options: null,
        },
        {
          id: 4,
          deckId: 1,
          createdAt: "2023-10-06T02:13:20.985Z",
          example: null,
          front: "year",
          back: "Год",
          type: "repeat",
          answerType: "remember",
          answers: null,
          options: null,
        },
        {
          id: 5,
          deckId: 1,
          createdAt: "2023-10-06T02:13:20.985Z",
          example: null,
          front: "way",
          back: "Дорога",
          type: "repeat",
          answerType: "remember",
          answers: null,
          options: null,
        },
        {
          id: 6,
          deckId: 1,
          createdAt: "2023-10-06T02:13:20.985Z",
          example: null,
          front: "card 4",
          back: "card 4",
          type: "repeat",
          answerType: "remember",
          answers: null,
          options: null,
        },

        {
          id: 7,
          deckId: 1,
          createdAt: "2023-10-06T02:13:20.985Z",
          example: null,
          front: "card 7",
          back: "card 7",
          type: "repeat",
          answerType: "remember",
          answers: null,
          options: null,
        },
        {
          id: 8,
          deckId: 1,
          createdAt: "2023-10-06T02:13:20.985Z",
          example: null,
          front: "card 8",
          back: "card 8",
          type: "repeat",
          answerType: "remember",
          answers: null,
          options: null,
        },
        {
          id: 9,
          deckId: 1,
          createdAt: "2023-10-06T02:13:20.985Z",
          example: null,
          front: "card 9",
          back: "card 9",
          type: "repeat",
          answerType: "remember",
          answers: null,
          options: null,
        },
      ]),
    );
    expect(reviewStore.isFinished).toBeFalsy();

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.sentResult).toEqual({ neverIds: [], rememberIds: [] });
    expect(reviewStore.cardsToSend).toEqual([
      { id: 3, outcome: "correct" },
      { id: 4, outcome: "correct" },
    ]);

    reviewStore.open();
    reviewStore.changeState(CardState.Never);
    await when(() => !reviewStore.reviewCardsRequestInProgress.isLoading);

    expect(reviewStore.sentResult).toEqual({
      neverIds: [5],
      rememberIds: [3, 4],
    });
    expect(reviewStore.cardsToSend).toEqual([]);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);

    expect(reviewStore.sentResult).toEqual({
      neverIds: [5],
      rememberIds: [3, 4],
    });
    expect(reviewStore.cardsToSend).toEqual([{ id: 6, outcome: "correct" }]);
    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(1);
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    await when(() => !reviewStore.reviewCardsRequestInProgress.isLoading);

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(2);
    expect(reviewStore.sentResult).toEqual({
      neverIds: [5],
      rememberIds: [3, 4, 6, 7, 8],
    });
    expect(reviewStore.cardsToSend).toEqual([]);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    await when(() => !reviewStore.reviewCardsRequestInProgress.isLoading);

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(2);
    expect(reviewStore.cardsToSend).toEqual([{ id: 9, outcome: "correct" }]);
  });

  it("basic", () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
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
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
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
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
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

  it("use 'never show' option", () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
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
    reviewStore.changeState(CardState.Never);
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState(CardState.Remember);
    expect(reviewStore.isFinished).toBeTruthy();

    expect(reviewStore.result.forgotIds).toHaveLength(3);
    expect(reviewStore.result.rememberIds).toHaveLength(0);
    expect(reviewStore.result.neverIds).toHaveLength(1);
  });

  it("hit wrong many times - prioritize forgotten new cards", () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
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
