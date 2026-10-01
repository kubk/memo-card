import { CardUnderReviewStore } from "./card-under-review-store.ts";
import { makeAutoObservable, runInAction } from "mobx";
import { ReviewOutcome, reviewCard } from "api";
import { screenStore } from "../../../store/screen-store.ts";
import {
  DeckCardDbTypeWithType,
  type DeckWithCardsWithReviewType,
} from "../../../store/deck-list-store.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { showConfirm } from "../../../lib/platform/show-confirm.ts";
import { t } from "../../../translations/t.ts";
import { makeMutation } from "../../../lib/mobx-query-lite/make-mutation.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";
import { reportHandledError } from "../../../lib/rollbar/rollbar.tsx";
import { assert } from "api";
import { api } from "../../../api/trpc-api.ts";
import { userStore } from "../../../store/user-store.ts";
import { shuffleInPlace } from "../../../lib/array/shuffle-in-place.ts";
import { separateReversePairs } from "./reverse-pair-shuffle.ts";
import { leaderboardStore } from "../../leaderboard/leaderboard-store.ts";

// Don't wait until the user has finished reviewing all the cards to send the progress
const cardProgressSend = 3;
const dayMs = 24 * 60 * 60 * 1000;

type ReviewResult = {
  againIds: number[];
  hardIds: number[];
  goodIds: number[];
  easyIds: number[];
  neverIds: number[];
};

export type ReviewedCard = {
  id: number;
  front: string;
  back: string;
  outcome: ReviewOutcome | "skip";
  deckName?: string;
};

type SilentSendResult = Pick<
  ReviewResult,
  "hardIds" | "goodIds" | "easyIds" | "neverIds"
>;

export class ReviewStore {
  private queue: CardUnderReviewStore[] = [];
  private head = 0;
  private reviewedCardIds = new Set<number>();
  private againIds = new Set<number>();
  currentCardId?: number;
  reviewedCards: ReviewedCard[] = [];
  reviewEvents: Array<{ id: number; outcome: ReviewOutcome }> = [];

  result: ReviewResult = {
    againIds: [],
    hardIds: [],
    goodIds: [],
    easyIds: [],
    neverIds: [],
  };
  sentResult: SilentSendResult = {
    hardIds: [],
    goodIds: [],
    easyIds: [],
    neverIds: [],
  };
  sentReviewEventCount = 0;
  initialCardCount?: number;

  reviewCardsMutation = makeMutation(api.cardsReview.mutate);
  reviewCardsInProgressMutation = makeMutation(api.cardsReview.mutate);
  pendingProgressPromise: Promise<void> | null = null;
  isStudyAnyway = false;

  constructor() {
    makeAutoObservable<this, "reviewedCardIds" | "againIds">(
      this,
      {
        pendingProgressPromise: false,
        reviewedCardIds: false,
        againIds: false,
      },
      { autoBind: true },
    );
  }

  get cardsToReview() {
    return this.queue.slice(this.head);
  }

  private removeCurrent() {
    this.head += 1;
  }

  private get queueSize() {
    return this.queue.length - this.head;
  }

  private get currentCardAtHead() {
    return this.queue[this.head];
  }

  private shuffleRepeatCards(cardsToReview: CardUnderReviewStore[]) {
    const repeatCards = cardsToReview.filter(
      (card) => card.cardReviewType === "repeat",
    );
    const newCards = cardsToReview.filter(
      (card) => card.cardReviewType === "new",
    );
    shuffleInPlace(repeatCards);
    if (userStore.isPaid) {
      separateReversePairs(repeatCards);
    }
    this.setQueue([...repeatCards, ...newCards]);
  }

  private setQueue(cards: CardUnderReviewStore[]) {
    this.queue = cards;
    this.head = 0;
  }

  private resetReviewSession() {
    this.reviewedCards = [];
    this.reviewedCardIds.clear();
    this.reviewEvents = [];
    this.sentReviewEventCount = 0;
  }

  get reviewedCardsCount() {
    assert(this.initialCardCount, "initialCardCount is empty");
    return this.initialCardCount - this.queueSize;
  }

  startDeckReview(
    deck: DeckWithCardsWithReviewType,
    filter?: (card: DeckCardDbTypeWithType) => boolean,
  ) {
    const cardsToReview = filter
      ? deck.cardsToReview.filter(filter)
      : deck.cardsToReview;
    if (!cardsToReview.length) {
      return;
    }

    this.resetReviewSession();
    const cardsUnderReview = this.cardsToReview;
    cardsToReview.forEach((card) => {
      cardsUnderReview.push(new CardUnderReviewStore(card, deck));
    });

    this.shuffleRepeatCards(cardsUnderReview);
    this.initializeInitialCurrentNextCards();
  }

  startDeckReviewAnyway(deck: DeckWithCardsWithReviewType | null) {
    if (!deck) {
      return;
    }
    this.resetReviewSession();
    const cardsToReview: CardUnderReviewStore[] = [];
    deck.deckCards.forEach((card) => {
      const reviewState = reviewCard(
        new Date(Date.now() - dayMs),
        undefined,
        "good",
      );
      const cardWithReview: DeckCardDbTypeWithType = {
        ...card,
        type: "repeat",
        ...reviewState,
      };
      cardsToReview.push(new CardUnderReviewStore(cardWithReview, deck));
    });
    if (cardsToReview.length) {
      this.isStudyAnyway = true;
    }
    shuffleInPlace(cardsToReview);
    if (userStore.isPaid) {
      separateReversePairs(cardsToReview);
    }
    this.setQueue(cardsToReview);
    this.initializeInitialCurrentNextCards();
  }

  startFolderReview(
    myDecks: DeckWithCardsWithReviewType[],
    filter?: (card: DeckCardDbTypeWithType) => boolean,
  ) {
    if (!myDecks.length) {
      return;
    }

    this.resetReviewSession();
    const cardsToReview = this.cardsToReview;
    myDecks.forEach((deck) => {
      const deckCards = filter
        ? deck.cardsToReview.filter(filter)
        : deck.cardsToReview;
      deckCards.forEach((card) => {
        cardsToReview.push(new CardUnderReviewStore(card, deck));
      });
    });

    this.shuffleRepeatCards(cardsToReview);
    this.initializeInitialCurrentNextCards();
  }

  startAllRepeatReview(myDecks: DeckWithCardsWithReviewType[]) {
    if (!myDecks.length) {
      return;
    }

    this.resetReviewSession();
    const cardsToReview = this.cardsToReview;
    myDecks.forEach((deck) => {
      deck.cardsToReview
        .filter((card) => card.type === "repeat")
        .forEach((card) => {
          cardsToReview.push(new CardUnderReviewStore(card, deck));
        });
    });

    shuffleInPlace(cardsToReview);
    if (userStore.isPaid) {
      separateReversePairs(cardsToReview);
    }
    this.setQueue(cardsToReview);
    this.initializeInitialCurrentNextCards();
  }

  startCustomReview(
    decks: Array<[DeckCardDbTypeWithType, DeckWithCardsWithReviewType]>,
  ) {
    if (!decks.length) {
      return;
    }

    this.resetReviewSession();
    const cardsToReview = this.cardsToReview;
    decks.forEach(([card, deck]) => {
      cardsToReview.push(new CardUnderReviewStore(card, deck));
    });

    this.shuffleRepeatCards(cardsToReview);
    this.initializeInitialCurrentNextCards();
  }

  private initializeInitialCurrentNextCards() {
    if (!this.queueSize) {
      return;
    }

    platform.haptic("light");

    this.initialCardCount = this.queueSize;
    this.currentCardId = this.currentCardAtHead?.id;
  }

  get currentCard() {
    if (!this.currentCardId) {
      return null;
    }

    const card = this.currentCardAtHead;
    return card?.id === this.currentCardId ? card : null;
  }

  open() {
    const currentCard = this.currentCard;
    assert(currentCard, "Current card should not be empty");
    if (currentCard.answerType === "remember") {
      const wasOpened = currentCard.isOpened;
      currentCard.open();
      currentCard.speak();
      if (!wasOpened) {
        platform.haptic("selection");
      }
    }
  }

  onReviewCardWithAnswers() {
    const currentCard = this.currentCard;
    assert(currentCard, "Current card should not be empty");

    assert(currentCard.answerType === "choice_single");
    const newState = currentCard.answer?.isCorrect ? "good" : "again";
    this.changeState(newState);
  }

  async onHideCardForever() {
    const isConfirmed = await showConfirm(t("hide_card_forever_confirm_title"));
    if (!isConfirmed) {
      return;
    }
    platform.haptic("heavy");
    this.changeState("never");
  }

  async onSkipCard() {
    const isConfirmed = await showConfirm(t("skip_card_confirm"));
    if (!isConfirmed) {
      return;
    }
    platform.haptic("light");

    const currentCard = this.currentCard;
    assert(currentCard, "currentCard should not be null while skipping");

    this.reviewedCards.push({
      id: currentCard.id,
      front: currentCard.front,
      back: currentCard.back,
      outcome: "skip",
      deckName: currentCard.deckName,
    });
    this.reviewedCardIds.add(currentCard.id);

    assert(
      this.currentCardAtHead?.id === currentCard.id,
      "Current card is not at the front of the review queue",
    );
    this.removeCurrent();

    if (this.queueSize !== 0) {
      this.currentCardId = this.currentCardAtHead?.id;
    }
  }

  changeState(cardState: ReviewOutcome) {
    const currentCard = this.currentCard;
    assert(
      currentCard,
      "currentCard should not be null while changing state in review",
    );
    currentCard.changeState(cardState);
    currentCard.updateAfterReview(cardState);
    this.reviewEvents.push({ id: currentCard.id, outcome: cardState });

    // Collect reviewed card data
    if (!this.reviewedCardIds.has(currentCard.id)) {
      this.reviewedCardIds.add(currentCard.id);
      this.reviewedCards.push({
        id: currentCard.id,
        front: currentCard.front,
        back: currentCard.back,
        outcome: cardState,
        deckName: currentCard.deckName,
      });
    }

    assert(
      this.currentCardAtHead?.id === currentCard.id,
      "Current card is not at the front of the review queue",
    );
    this.removeCurrent();
    if (currentCard.state === "again") {
      if (!this.againIds.has(currentCard.id)) {
        this.result.againIds.push(currentCard.id);
        this.againIds.add(currentCard.id);
      }
      currentCard.close();

      if (currentCard.cardReviewType === "new") {
        const newIndex = Math.min(2, this.queueSize);
        this.queue.splice(this.head + newIndex, 0, currentCard);
      } else {
        this.queue.push(currentCard);
      }
    }

    if (currentCard.state === "hard" && !this.againIds.has(currentCard.id)) {
      this.result.hardIds.push(currentCard.id);
    }

    if (currentCard.state === "good" && !this.againIds.has(currentCard.id)) {
      this.result.goodIds.push(currentCard.id);
    }

    if (currentCard.state === "easy" && !this.againIds.has(currentCard.id)) {
      this.result.easyIds.push(currentCard.id);
    }

    if (currentCard.state === "never") {
      this.againIds.delete(currentCard.id);
      this.result.againIds = this.result.againIds.filter(
        (id) => id !== currentCard.id,
      );
      this.result.hardIds = this.result.hardIds.filter(
        (id) => id !== currentCard.id,
      );
      this.result.goodIds = this.result.goodIds.filter(
        (id) => id !== currentCard.id,
      );
      this.result.easyIds = this.result.easyIds.filter(
        (id) => id !== currentCard.id,
      );
      this.result.neverIds.push(currentCard.id);
    }

    if (this.queueSize !== 0) {
      // Go to next card
      this.currentCardId = this.currentCardAtHead?.id;
    }

    this.sendProgress();
  }

  private sendProgress() {
    if (
      this.reviewCardsMutation.isPending ||
      this.reviewCardsInProgressMutation.isPending
    ) {
      return;
    }

    const cardsToSendInProgress = this.cardsToSend;

    const shouldSendInProgress =
      cardsToSendInProgress.length >= cardProgressSend;
    if (!shouldSendInProgress) {
      return;
    }

    const progressPromise = this.sendProgressBatch(cardsToSendInProgress);
    this.pendingProgressPromise = progressPromise;
    progressPromise.finally(() => {
      if (this.pendingProgressPromise === progressPromise) {
        this.pendingProgressPromise = null;
      }
    });
  }

  private async sendProgressBatch(
    cardsToSendInProgress: Array<{ id: number; outcome: ReviewOutcome }>,
  ) {
    const result = await this.reviewCardsInProgressMutation.mutateResult({
      cards: cardsToSendInProgress,
      isStudyAnyway: this.isStudyAnyway,
    });

    if (!result.ok) {
      reportHandledError("Error sending review progress", { e: result.error });
      return;
    }

    runInAction(() => {
      const cardCount = cardsToSendInProgress.length;
      const { hardIds, goodIds, easyIds, neverIds } = this.sentResult;

      for (let index = 0; index < cardCount; index += 1) {
        const card = cardsToSendInProgress[index];
        const outcome = card.outcome;

        if (outcome === "hard") {
          hardIds.push(card.id);
        } else if (outcome === "good") {
          goodIds.push(card.id);
        } else if (outcome === "easy") {
          easyIds.push(card.id);
        } else if (outcome === "never") {
          neverIds.push(card.id);
        }
      }

      this.sentReviewEventCount += cardCount;
    });
    leaderboardStore.leaderboardQuery.invalidate();
  }

  get isFinished() {
    return this.queueSize === 0 && this.hasResult;
  }

  get hasResult() {
    return (
      this.result.againIds.length ||
      this.result.hardIds.length ||
      this.result.goodIds.length ||
      this.result.easyIds.length ||
      this.result.neverIds.length ||
      this.reviewedCards.some((card) => card.outcome === "skip")
    );
  }

  submitUnfinished() {
    screenStore.push({ type: "main" });

    if (!this.hasResult) {
      return;
    }

    return this.submitUnfinishedAfterPendingProgress();
  }

  private async submitUnfinishedAfterPendingProgress() {
    await this.pendingProgressPromise;

    if (!this.cardsToSend.length) {
      return;
    }

    return api.cardsReview
      .mutate({
        cards: this.cardsToSend,
        isInterrupted: true,
        skipReview: userStore.isSkipReview.value,
        isStudyAnyway: this.isStudyAnyway,
      })
      .then(() => {
        leaderboardStore.leaderboardQuery.invalidate();
      });
  }

  get cardsToSend(): Array<{ id: number; outcome: ReviewOutcome }> {
    return this.reviewEvents.slice(this.sentReviewEventCount);
  }

  async submitFinished(onReviewSuccess?: () => void) {
    if (!this.hasResult) {
      screenStore.push({ type: "main" });
      return;
    }

    await this.pendingProgressPromise;
    const cardsToSend = this.cardsToSend;

    if (!cardsToSend.length) {
      onReviewSuccess?.();
      platform.haptic("success");
      return;
    }

    const result = await this.reviewCardsMutation.mutateResult({
      cards: cardsToSend,
      isStudyAnyway: this.isStudyAnyway,
      skipReview: userStore.isSkipReview.value,
    });
    if (!result.ok) {
      notifyError({ e: result.error, info: "Error submitting review" });
      return;
    }
    leaderboardStore.leaderboardQuery.invalidate();
    onReviewSuccess?.();
    platform.haptic("success");
  }

  onAgain() {
    if (this.currentCard?.isOpened) {
      platform.haptic("medium");
      this.changeState("again");
    }
  }

  onHard() {
    if (this.currentCard?.isOpened) {
      platform.haptic("light");
      this.changeState("hard");
    }
  }

  onGood() {
    if (this.currentCard?.isOpened) {
      platform.haptic("light");
      this.changeState("good");
    }
  }

  onEasy() {
    if (this.currentCard?.isOpened) {
      platform.haptic("light");
      this.changeState("easy");
    }
  }

  get sortedReviewedCards() {
    const outcomeOrder = {
      again: 0,
      hard: 1,
      good: 2,
      easy: 3,
      never: 4,
      skip: 5,
    };
    return this.reviewedCards
      .slice()
      .sort((a, b) => outcomeOrder[a.outcome] - outcomeOrder[b.outcome]);
  }
}
