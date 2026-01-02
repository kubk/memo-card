import { afterEach, describe, expect, it, vi } from "vitest";
import { CardUnderReviewStore } from "./card-under-review-store.ts";
import { ReviewStore } from "./review-store.ts";
import {
  DeckCardDbTypeWithType,
  DeckWithCardsWithReviewType,
} from "../../../store/deck-list-store.ts";
import { when } from "mobx";
import {
  DEFAULT_EASE_FACTOR,
  DEFAULT_REPEAT_INTERVAL,
  DEFAULT_START_INTERVAL,
} from "api";

vi.mock(import("../../../lib/array/shuffle-in-place.ts"), () =>
  import("../../../lib/array/shuffle-in-place.mock.ts").then((m) => m.mock()),
);

function createMockCardWithReview(
  id: number,
  front: string,
  back: string,
  type: "new" | "repeat",
): DeckCardDbTypeWithType {
  return {
    id,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front,
    back,
    type,
    interval: type === "new" ? DEFAULT_START_INTERVAL : DEFAULT_REPEAT_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
    answerType: "remember",
    answers: null,
    options: null,
  };
}

vi.mock("mobx-persist-store", () => {
  return {
    makePersistable: () => {},
  };
});

vi.mock(import("../../../lib/platform/show-confirm.ts"), () =>
  import("../../../lib/platform/show-confirm.mock.ts").then((m) => m.mock()),
);
vi.mock(import("../../../translations/t.ts"), () =>
  import("../../../translations/t.mock.ts").then((m) => m.mock()),
);

const createDeckWithCards = (cards: DeckCardDbTypeWithType[]) => {
  const deckMock: DeckWithCardsWithReviewType = {
    id: 1,
    name: "English",
    description: "English words",
    deckCards: cards,
    cardsToReview: cards,
    speakField: null,
    speakLocale: null,
    speakAutoAi: false,
    reverseCards: false,
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
    interval: DEFAULT_REPEAT_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
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
    interval: DEFAULT_REPEAT_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
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
    interval: DEFAULT_REPEAT_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
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
    interval: DEFAULT_REPEAT_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
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
    interval: DEFAULT_START_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
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
    interval: DEFAULT_START_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
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
    interval: DEFAULT_START_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
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
    interval: DEFAULT_START_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
    answerType: "remember",
    answers: null,
    options: null,
  },
];

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

vi.mock(import("../../../lib/voice-playback/speak.ts"), () =>
  import("../../../lib/voice-playback/speak.mock.ts").then((m) => m.mock()),
);

vi.mock("../../../store/user-store.ts", () => {
  return {
    userStore: {},
  };
});

vi.mock(import("../../shared/snackbar/snackbar.tsx"), () => {
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

  it("test silent progress send with hard cards", async () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(0);
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(
      createDeckWithCards([
        createMockCardWithReview(1, "card1", "card1", "repeat"),
        createMockCardWithReview(2, "card2", "card2", "repeat"),
        createMockCardWithReview(3, "card3", "card3", "repeat"),
        createMockCardWithReview(4, "card4", "card4", "repeat"),
        createMockCardWithReview(5, "card5", "card5", "repeat"),
      ]),
    );

    // Review 2 cards with "hard" - should not trigger send yet
    reviewStore.open();
    reviewStore.changeState("hard");
    reviewStore.open();
    reviewStore.changeState("hard");

    expect(reviewStore.sentResult).toEqual({
      hardIds: [],
      neverIds: [],
      goodIds: [],
      easyIds: [],
    });

    // Review 3rd card with "hard" - should trigger send
    reviewStore.open();
    reviewStore.changeState("hard");
    await when(() => !reviewStore.reviewCardsRequestInProgress.isLoading);

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(1);
    expect(reviewStore.sentResult).toEqual({
      hardIds: [1, 2, 3],
      neverIds: [],
      goodIds: [],
      easyIds: [],
    });
  });

  it("test silent progress send", async () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(0);
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(
      createDeckWithCards([
        createMockCardWithReview(3, "time", "Время", "repeat"),
        createMockCardWithReview(4, "year", "Год", "repeat"),
        createMockCardWithReview(5, "way", "Дорога", "repeat"),
        {
          id: 6,
          deckId: 1,
          createdAt: "2023-10-06T02:13:20.985Z",
          example: null,
          front: "card 4",
          back: "card 4",
          type: "repeat",
          interval: DEFAULT_REPEAT_INTERVAL,
          easeFactor: DEFAULT_EASE_FACTOR,
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
          interval: DEFAULT_REPEAT_INTERVAL,
          easeFactor: DEFAULT_EASE_FACTOR,
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
          interval: DEFAULT_REPEAT_INTERVAL,
          easeFactor: DEFAULT_EASE_FACTOR,
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
          interval: DEFAULT_REPEAT_INTERVAL,
          easeFactor: DEFAULT_EASE_FACTOR,
          answerType: "remember",
          answers: null,
          options: null,
        },
      ]),
    );
    expect(reviewStore.isFinished).toBeFalsy();

    reviewStore.open();
    reviewStore.changeState("good");
    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.sentResult).toEqual({
      hardIds: [],
      neverIds: [],
      goodIds: [],
      easyIds: [],
    });
    expect(reviewStore.cardsToSend).toEqual([
      { id: 3, outcome: "good" },
      { id: 4, outcome: "good" },
    ]);

    reviewStore.open();
    reviewStore.changeState("never");
    await when(() => !reviewStore.reviewCardsRequestInProgress.isLoading);

    expect(reviewStore.sentResult).toEqual({
      hardIds: [],
      neverIds: [5],
      goodIds: [3, 4],
      easyIds: [],
    });
    expect(reviewStore.cardsToSend).toEqual([]);

    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.sentResult).toEqual({
      hardIds: [],
      neverIds: [5],
      goodIds: [3, 4],
      easyIds: [],
    });
    expect(reviewStore.cardsToSend).toEqual([{ id: 6, outcome: "good" }]);
    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(1);
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());

    reviewStore.open();
    reviewStore.changeState("good");
    reviewStore.open();
    reviewStore.changeState("good");
    await when(() => !reviewStore.reviewCardsRequestInProgress.isLoading);

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(2);
    expect(reviewStore.sentResult).toEqual({
      hardIds: [],
      neverIds: [5],
      goodIds: [3, 4, 6, 7, 8],
      easyIds: [],
    });
    expect(reviewStore.cardsToSend).toEqual([]);

    reviewStore.open();
    reviewStore.changeState("good");
    await when(() => !reviewStore.reviewCardsRequestInProgress.isLoading);

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(2);
    expect(reviewStore.cardsToSend).toEqual([{ id: 9, outcome: "good" }]);
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
    reviewStore.changeState("good");

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
    reviewStore.changeState("again");

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
            "state": "again",
          },
        ]
      `);

    reviewStore.open();
    reviewStore.changeState("good");
    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.cardsToReview).toHaveLength(2);

    reviewStore.open();
    reviewStore.changeState("good");

    reviewStore.open();
    reviewStore.changeState("good");
    expect(reviewStore.isFinished).toBeTruthy();

    expect(reviewStore.result.againIds).toEqual([4]);
    expect(reviewStore.result.goodIds).toEqual([3, 5, 6]);
  });

  it("current next", () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(createDeckWithCards(repeatCardsMock));
    expect(reviewStore.isFinished).toBeFalsy();

    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("again");

    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.currentCard?.id).toEqual(6);

    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("again");

    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.currentCard).toBeFalsy();
  });

  it("hit wrong many times", () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(createDeckWithCards(repeatCardsMock));
    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(6);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(5);

    expect(reviewStore.result.againIds).toHaveLength(4);
    expect(reviewStore.result.goodIds).toHaveLength(0);

    reviewStore.open();
    reviewStore.changeState("good");

    reviewStore.open();
    reviewStore.changeState("good");

    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.result.againIds).toHaveLength(4);
    expect(reviewStore.result.goodIds).toHaveLength(0);
    expect(reviewStore.currentCard?.id).toEqual(4);
  });

  it("use 'never show' option", () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(createDeckWithCards(repeatCardsMock));
    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(6);

    reviewStore.open();
    reviewStore.changeState("never");
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState("good");
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("good");
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState("good");
    expect(reviewStore.isFinished).toBeTruthy();

    expect(reviewStore.result.againIds).toHaveLength(3);
    expect(reviewStore.result.goodIds).toHaveLength(0);
    expect(reviewStore.result.neverIds).toHaveLength(1);
  });

  it("hit wrong many times - prioritize forgotten new cards", () => {
    reviewCardsReviewMock.mockResolvedValueOnce(() => Promise.resolve());
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(createDeckWithCards(newCardsMock));

    expect(reviewStore.isFinished).toBeFalsy();
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(3);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(4);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(5);

    reviewStore.open();
    reviewStore.changeState("again");
    expect(reviewStore.currentCard?.id).toEqual(3);

    expect(reviewStore.result.againIds).toHaveLength(3);
    expect(reviewStore.result.goodIds).toHaveLength(0);

    reviewStore.open();
    reviewStore.changeState("good");

    reviewStore.open();
    reviewStore.changeState("good");

    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.result.againIds).toHaveLength(3);
    expect(reviewStore.result.goodIds).toHaveLength(0);
    expect(reviewStore.currentCard?.id).toEqual(6);
  });
});
