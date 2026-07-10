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
  cardsToReview: CardUnderReviewStore[] = [];
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
    makeAutoObservable(
      this,
      { pendingProgressPromise: false },
      { autoBind: true },
    );
  }

  private shuffleRepeatCards() {
    const repeatCards = this.cardsToReview.filter(
      (card) => card.cardReviewType === "repeat",
    );
    const newCards = this.cardsToReview.filter(
      (card) => card.cardReviewType === "new",
    );
    shuffleInPlace(repeatCards);
    if (userStore.isPaid) {
      separateReversePairs(repeatCards);
    }
    this.cardsToReview = [...repeatCards, ...newCards];
  }

  get reviewedCardsCount() {
    assert(this.initialCardCount, "initialCardCount is empty");
    return this.initialCardCount - this.cardsToReview.length;
  }

  startDeckReview(deck: DeckWithCardsWithReviewType) {
    if (!deck.cardsToReview.length) {
      return;
    }

    this.reviewedCards = [];
    this.reviewEvents = [];
    this.sentReviewEventCount = 0;
    deck.cardsToReview.forEach((card) => {
      this.cardsToReview.push(new CardUnderReviewStore(card, deck));
    });

    this.shuffleRepeatCards();
    this.initializeInitialCurrentNextCards();
  }

  startDeckReviewAnyway(deck: DeckWithCardsWithReviewType | null) {
    if (!deck) {
      return;
    }
    this.cardsToReview = [];
    this.reviewedCards = [];
    this.reviewEvents = [];
    this.sentReviewEventCount = 0;
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
      this.cardsToReview.push(new CardUnderReviewStore(cardWithReview, deck));
    });
    if (this.cardsToReview.length) {
      this.isStudyAnyway = true;
    }
    shuffleInPlace(this.cardsToReview);
    if (userStore.isPaid) {
      separateReversePairs(this.cardsToReview);
    }
    this.initializeInitialCurrentNextCards();
  }

  startFolderReview(myDecks: DeckWithCardsWithReviewType[]) {
    if (!myDecks.length) {
      return;
    }

    this.reviewedCards = [];
    this.reviewEvents = [];
    this.sentReviewEventCount = 0;
    myDecks.forEach((deck) => {
      deck.cardsToReview.forEach((card) => {
        this.cardsToReview.push(new CardUnderReviewStore(card, deck));
      });
    });

    this.shuffleRepeatCards();
    this.initializeInitialCurrentNextCards();
  }

  startAllRepeatReview(myDecks: DeckWithCardsWithReviewType[]) {
    if (!myDecks.length) {
      return;
    }

    this.reviewedCards = [];
    this.reviewEvents = [];
    this.sentReviewEventCount = 0;
    myDecks.forEach((deck) => {
      deck.cardsToReview
        .filter((card) => card.type === "repeat")
        .forEach((card) => {
          this.cardsToReview.push(new CardUnderReviewStore(card, deck));
        });
    });

    shuffleInPlace(this.cardsToReview);
    if (userStore.isPaid) {
      separateReversePairs(this.cardsToReview);
    }
    this.initializeInitialCurrentNextCards();
  }

  startCustomReview(
    decks: Array<[DeckCardDbTypeWithType, DeckWithCardsWithReviewType]>,
  ) {
    if (!decks.length) {
      return;
    }

    this.reviewedCards = [];
    this.reviewEvents = [];
    this.sentReviewEventCount = 0;
    decks.forEach(([card, deck]) => {
      this.cardsToReview.push(new CardUnderReviewStore(card, deck));
    });

    this.shuffleRepeatCards();
    this.initializeInitialCurrentNextCards();
  }

  private initializeInitialCurrentNextCards() {
    if (!this.cardsToReview.length) {
      return;
    }

    platform.haptic("light");

    this.initialCardCount = this.cardsToReview.length;
    this.currentCardId = this.cardsToReview[0].id;
  }

  get currentCard() {
    if (!this.currentCardId) {
      return null;
    }

    return (
      this.cardsToReview.find((card) => this.currentCardId === card.id) || null
    );
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

    const currentCardIdx = this.cardsToReview.findIndex(
      (card) => card.id === currentCard.id,
    );
    assert(currentCardIdx !== -1, "currentCardIdx is empty");
    this.cardsToReview.splice(currentCardIdx, 1);

    if (this.cardsToReview.length !== 0) {
      this.currentCardId = this.cardsToReview[0].id;
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
    const existingCardIdx = this.reviewedCards.findIndex(
      (card) => card.id === currentCard.id,
    );
    if (existingCardIdx === -1) {
      this.reviewedCards.push({
        id: currentCard.id,
        front: currentCard.front,
        back: currentCard.back,
        outcome: cardState,
        deckName: currentCard.deckName,
      });
    }

    const currentCardIdx = this.cardsToReview.findIndex(
      (card) => card.id === currentCard.id,
    );
    assert(currentCardIdx !== -1, "currentCardIdx is empty");
    this.cardsToReview.splice(currentCardIdx, 1);
    if (currentCard.state === "again") {
      if (!this.result.againIds.includes(currentCard.id)) {
        this.result.againIds.push(currentCard.id);
      }
      currentCard.close();

      if (currentCard.cardReviewType === "new") {
        // Calculate new index, ensuring it doesn't exceed the array length
        const newIndex = Math.min(
          currentCardIdx + 2,
          this.cardsToReview.length,
        );
        // Insert the card at the new index
        // This way, the incorrectly answered card is reinserted 3 positions ahead,
        // or at the end of the queue if there are less than 3 cards left.
        this.cardsToReview.splice(newIndex, 0, currentCard);
      } else {
        this.cardsToReview.push(currentCard);
      }
    }

    if (
      currentCard.state === "hard" &&
      !this.result.againIds.includes(currentCard.id)
    ) {
      this.result.hardIds.push(currentCard.id);
    }

    if (
      currentCard.state === "good" &&
      !this.result.againIds.includes(currentCard.id)
    ) {
      this.result.goodIds.push(currentCard.id);
    }

    if (
      currentCard.state === "easy" &&
      !this.result.againIds.includes(currentCard.id)
    ) {
      this.result.easyIds.push(currentCard.id);
    }

    if (currentCard.state === "never") {
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

    if (this.cardsToReview.length !== 0) {
      // Go to next card
      this.currentCardId = this.cardsToReview[0].id;
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
      this.sentResult.hardIds.push(
        ...cardsToSendInProgress
          .filter((sentCard) => sentCard.outcome === "hard")
          .map((sentCard) => sentCard.id),
      );
      this.sentResult.goodIds.push(
        ...cardsToSendInProgress
          .filter((sentCard) => sentCard.outcome === "good")
          .map((sentCard) => sentCard.id),
      );
      this.sentResult.easyIds.push(
        ...cardsToSendInProgress
          .filter((sentCard) => sentCard.outcome === "easy")
          .map((sentCard) => sentCard.id),
      );
      this.sentResult.neverIds.push(
        ...cardsToSendInProgress
          .filter((sentCard) => sentCard.outcome === "never")
          .map((sentCard) => sentCard.id),
      );
      this.sentReviewEventCount += cardsToSendInProgress.length;
    });
  }

  get isFinished() {
    return this.cardsToReview.length === 0 && this.hasResult;
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

    return api.cardsReview.mutate({
      cards: this.cardsToSend,
      isInterrupted: true,
      skipReview: userStore.isSkipReview.value,
      isStudyAnyway: this.isStudyAnyway,
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
