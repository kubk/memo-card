import { afterEach, describe, expect, it, vi } from "vitest";
import { CardUnderReviewStore } from "./card-under-review-store.ts";
import { ReviewStore } from "./review-store.ts";
import {
  DeckCardDbTypeWithType,
  DeckWithCardsWithReviewType,
} from "../../../store/deck-list-store.ts";
import { when } from "mobx";
import { createInitialFsrsReviewState, reviewCard } from "api";

vi.mock(import("../../../lib/array/shuffle-in-place.ts"), () =>
  import("../../../lib/array/shuffle-in-place.mock.ts").then((m) => m.mock()),
);

function createMockCardWithReview(
  id: number,
  front: string,
  back: string,
  type: "new" | "repeat",
): DeckCardDbTypeWithType {
  const reviewState =
    type === "new"
      ? createInitialFsrsReviewState(new Date("2026-01-01T00:00:00.000Z"))
      : reviewCard(new Date("2025-12-31T00:00:00.000Z"), undefined, "good");

  return {
    id,
    deckId: 1,
    createdAt: "2023-10-06T02:13:20.985Z",
    example: null,
    front,
    back,
    type,
    ...reviewState,
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

const showConfirmMock = vi.hoisted(() => vi.fn());
vi.mock("../../../lib/platform/show-confirm.ts", () => ({
  showConfirm: showConfirmMock,
}));
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
    authorId: 1,
    shareId: "share_id_mock2",
    isPublic: false,
    cardInputModeId: null,
  };
  return deckMock;
};

const repeatCardsMock: DeckCardDbTypeWithType[] = [
  createMockCardWithReview(3, "time", "Время", "repeat"),
  createMockCardWithReview(4, "year", "Год", "repeat"),
  createMockCardWithReview(5, "way", "Дорога", "repeat"),
  createMockCardWithReview(6, "card 4", "card 4", "repeat"),
];

const newCardsMock: DeckCardDbTypeWithType[] = [
  createMockCardWithReview(3, "time", "Время", "new"),
  createMockCardWithReview(4, "year", "Год", "new"),
  createMockCardWithReview(5, "way", "Дорога", "new"),
  createMockCardWithReview(6, "card 4", "card 4", "new"),
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
    userStore: {
      isPaid: true,
      isSkipReview: { value: false },
    },
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
    await when(() => !reviewStore.reviewCardsInProgressMutation.isPending);

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(1);
    expect(reviewStore.sentResult).toEqual({
      hardIds: [1, 2, 3],
      neverIds: [],
      goodIds: [],
      easyIds: [],
    });
  });

  it("waits for in-flight silent progress before final submit", async () => {
    let resolveProgress: () => void = () => {};
    reviewCardsReviewMock
      .mockReturnValueOnce(
        new Promise<void>((resolve) => {
          resolveProgress = resolve;
        }),
      )
      .mockResolvedValueOnce(undefined);

    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(
      createDeckWithCards([
        createMockCardWithReview(1, "card1", "card1", "repeat"),
        createMockCardWithReview(2, "card2", "card2", "repeat"),
        createMockCardWithReview(3, "card3", "card3", "repeat"),
        createMockCardWithReview(4, "card4", "card4", "repeat"),
      ]),
    );

    reviewStore.open();
    reviewStore.changeState("hard");
    reviewStore.open();
    reviewStore.changeState("hard");
    reviewStore.open();
    reviewStore.changeState("hard");
    reviewStore.open();
    reviewStore.changeState("hard");

    const onReviewSuccess = vi.fn();
    const submitPromise = reviewStore.submitFinished(onReviewSuccess);

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(1);
    expect(reviewCardsReviewMock.mock.calls[0]?.[0].cards).toEqual([
      { id: 1, outcome: "hard" },
      { id: 2, outcome: "hard" },
      { id: 3, outcome: "hard" },
    ]);

    resolveProgress();
    await submitPromise;

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(2);
    expect(reviewCardsReviewMock.mock.calls[1]?.[0].cards).toEqual([
      { id: 4, outcome: "hard" },
    ]);
    expect(onReviewSuccess).toHaveBeenCalledTimes(1);
  });

  it("avoids consecutive reverse pairs in repeat cards", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(
      createDeckWithCards([
        createMockCardWithReview(1, "cat", "кот", "repeat"),
        createMockCardWithReview(2, "кот", "cat", "repeat"),
        createMockCardWithReview(3, "dog", "собака", "repeat"),
      ]),
    );

    expect(reviewStore.cardsToReview.map((card) => card.id)).toEqual([1, 3, 2]);
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
        createMockCardWithReview(6, "card 4", "card 4", "repeat"),
        createMockCardWithReview(7, "card 7", "card 7", "repeat"),
        createMockCardWithReview(8, "card 8", "card 8", "repeat"),
        createMockCardWithReview(9, "card 9", "card 9", "repeat"),
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
    await when(() => !reviewStore.reviewCardsInProgressMutation.isPending);

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
    await when(() => !reviewStore.reviewCardsInProgressMutation.isPending);

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
    await when(() => !reviewStore.reviewCardsInProgressMutation.isPending);

    expect(reviewCardsReviewMock).toHaveBeenCalledTimes(2);
    expect(reviewStore.cardsToSend).toEqual([{ id: 9, outcome: "good" }]);
  });

  it("keeps same-card again and recovery as chronological events", () => {
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(
      createDeckWithCards([
        createMockCardWithReview(1, "card1", "card1", "repeat"),
      ]),
    );

    reviewStore.open();
    reviewStore.changeState("again");
    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.cardsToSend).toEqual([
      { id: 1, outcome: "again" },
      { id: 1, outcome: "good" },
    ]);
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

  it("skip card removes it from queue and shows in results", async () => {
    showConfirmMock.mockResolvedValueOnce(true);
    const reviewStore = new ReviewStore();
    reviewStore.startDeckReview(createDeckWithCards(repeatCardsMock));
    expect(reviewStore.currentCard?.id).toEqual(3);

    // Skip the first card
    await reviewStore.onSkipCard();

    // Should move to next card
    expect(reviewStore.currentCard?.id).toEqual(4);

    // Skipped card should be in reviewedCards but not in result IDs
    expect(reviewStore.reviewedCards).toHaveLength(1);
    expect(reviewStore.reviewedCards[0].outcome).toEqual("skip");
    expect(reviewStore.result.againIds).toHaveLength(0);
    expect(reviewStore.result.neverIds).toHaveLength(0);

    // Complete remaining cards
    reviewStore.open();
    reviewStore.changeState("good");
    reviewStore.open();
    reviewStore.changeState("good");
    reviewStore.open();
    reviewStore.changeState("good");

    expect(reviewStore.isFinished).toBeTruthy();
    expect(reviewStore.reviewedCards).toHaveLength(4);
    expect(reviewStore.sortedReviewedCards[3].outcome).toEqual("skip");
  });
});
