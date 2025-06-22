import { CardState, CardUnderReviewStore } from "./card-under-review-store.ts";
import { makeAutoObservable, runInAction } from "mobx";
import { ReviewOutcome } from "api";
import { screenStore } from "../../../store/screen-store.ts";
import {
  DeckCardDbTypeWithType,
  type DeckWithCardsWithReviewType,
} from "../../../store/deck-list-store.ts";
import {
  hapticImpact,
  hapticNotification,
} from "../../../lib/platform/telegram/haptics.ts";
import { showConfirm } from "../../../lib/platform/show-confirm.ts";
import { t } from "../../../translations/t.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";
import { reportHandledError } from "../../../lib/rollbar/rollbar.tsx";
import { assert } from "api";
import { api } from "../../../api/trpc-api.ts";

// Don't wait until the user has finished reviewing all the cards to send the progress
const cardProgressSend = 3;

type ReviewResult = {
  forgotIds: number[];
  rememberIds: number[];
  neverIds: number[];
};

type SilentSendResult = Pick<ReviewResult, "rememberIds" | "neverIds">;

export class ReviewStore {
  cardsToReview: CardUnderReviewStore[] = [];
  currentCardId?: number;

  result: ReviewResult = { forgotIds: [], rememberIds: [], neverIds: [] };
  sentResult: SilentSendResult = {
    rememberIds: [],
    neverIds: [],
  };
  initialCardCount?: number;

  reviewCardsRequest = new RequestStore(api.cardsReview.mutate);
  reviewCardsRequestInProgress = new RequestStore(api.cardsReview.mutate);
  isStudyAnyway = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get reviewedCardsCount() {
    assert(this.initialCardCount, "initialCardCount is empty");
    return this.initialCardCount - this.cardsToReview.length;
  }

  startDeckReview(deck: DeckWithCardsWithReviewType) {
    if (!deck.cardsToReview.length) {
      return;
    }

    deck.cardsToReview.forEach((card) => {
      this.cardsToReview.push(new CardUnderReviewStore(card, deck, card.type));
    });

    this.initializeInitialCurrentNextCards();
  }

  startDeckReviewAnyway(deck: DeckWithCardsWithReviewType | null) {
    if (!deck) {
      return;
    }
    this.cardsToReview = [];
    deck.deckCards.forEach((card) => {
      this.cardsToReview.push(new CardUnderReviewStore(card, deck, "repeat"));
    });
    if (this.cardsToReview.length) {
      this.isStudyAnyway = true;
    }
    this.initializeInitialCurrentNextCards();
  }

  startFolderReview(myDecks: DeckWithCardsWithReviewType[]) {
    if (!myDecks.length) {
      return;
    }

    myDecks.forEach((deck) => {
      deck.cardsToReview.forEach((card) => {
        this.cardsToReview.push(
          new CardUnderReviewStore(card, deck, card.type),
        );
      });
    });

    this.initializeInitialCurrentNextCards();
  }

  startAllRepeatReview(myDecks: DeckWithCardsWithReviewType[]) {
    if (!myDecks.length) {
      return;
    }

    myDecks.forEach((deck) => {
      deck.cardsToReview
        .filter((card) => card.type === "repeat")
        .forEach((card) => {
          this.cardsToReview.push(
            new CardUnderReviewStore(card, deck, card.type),
          );
        });
    });

    this.initializeInitialCurrentNextCards();
  }

  startCustomReview(
    decks: Array<[DeckCardDbTypeWithType, DeckWithCardsWithReviewType]>,
  ) {
    if (!decks.length) {
      return;
    }

    decks.forEach(([card, deck]) => {
      this.cardsToReview.push(new CardUnderReviewStore(card, deck, card.type));
    });

    this.initializeInitialCurrentNextCards();
  }

  private initializeInitialCurrentNextCards() {
    if (!this.cardsToReview.length) {
      return;
    }

    hapticImpact("light");

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
      currentCard.open();
      currentCard.speak();
    }
  }

  onReviewCardWithAnswers() {
    const currentCard = this.currentCard;
    assert(currentCard, "Current card should not be empty");

    assert(currentCard.answerType === "choice_single");
    const newState = currentCard.answer?.isCorrect
      ? CardState.Remember
      : CardState.Forget;
    this.changeState(newState);
  }

  async onHideCardForever() {
    const isConfirmed = await showConfirm(t("hide_card_forever_confirm_title"));
    if (!isConfirmed) {
      return;
    }
    hapticImpact("heavy");
    this.changeState(CardState.Never);
  }

  changeState(cardState: CardState) {
    const currentCard = this.currentCard;
    assert(
      currentCard,
      "currentCard should not be null while changing state in review",
    );
    currentCard.changeState(cardState);

    const currentCardIdx = this.cardsToReview.findIndex(
      (card) => card.id === currentCard.id,
    );
    assert(currentCardIdx !== -1, "currentCardIdx is empty");
    this.cardsToReview.splice(currentCardIdx, 1);
    if (currentCard.state === CardState.Forget) {
      if (!this.result.forgotIds.includes(currentCard.id)) {
        this.result.forgotIds.push(currentCard.id);
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
      currentCard.state === CardState.Remember &&
      !this.result.forgotIds.includes(currentCard.id)
    ) {
      this.result.rememberIds.push(currentCard.id);
    }

    if (currentCard.state === CardState.Never) {
      this.result.forgotIds = this.result.forgotIds.filter(
        (id) => id !== currentCard.id,
      );
      this.result.rememberIds = this.result.rememberIds.filter(
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

  private async sendProgress() {
    if (
      this.reviewCardsRequest.isLoading ||
      this.reviewCardsRequestInProgress.isLoading
    ) {
      return;
    }

    const cardsToSendInProgress = this.cardsToSend.filter(
      (card) => card.outcome === "correct" || card.outcome === "never",
    );

    const shouldSendInProgress =
      cardsToSendInProgress.length >= cardProgressSend;
    if (!shouldSendInProgress) {
      return;
    }

    const result = await this.reviewCardsRequestInProgress.execute({
      cards: cardsToSendInProgress,
      isStudyAnyway: this.isStudyAnyway,
    });

    if (result.status === "error") {
      reportHandledError("Error sending review progress", { e: result.error });
      return;
    }

    runInAction(() => {
      this.sentResult.rememberIds.push(
        ...cardsToSendInProgress
          .filter((sentCard) => sentCard.outcome === "correct")
          .map((sentCard) => sentCard.id),
      );
      this.sentResult.neverIds.push(
        ...cardsToSendInProgress
          .filter((sentCard) => sentCard.outcome === "never")
          .map((sentCard) => sentCard.id),
      );
    });
  }

  get isFinished() {
    return this.cardsToReview.length === 0 && this.hasResult;
  }

  get hasResult() {
    return (
      this.result.forgotIds.length ||
      this.result.rememberIds.length ||
      this.result.neverIds.length
    );
  }

  submitUnfinished() {
    screenStore.go({ type: "main" });

    if (!this.hasResult) {
      return;
    }

    return api.cardsReview.mutate({
      cards: this.cardsToSend,
      isInterrupted: true,
      isStudyAnyway: this.isStudyAnyway,
    });
  }

  get cardsToSend(): Array<{ id: number; outcome: ReviewOutcome }> {
    const forgotResult = this.result.forgotIds.map((forgotId) => ({
      id: forgotId,
      outcome: "wrong" as const,
    }));

    const rememberResult = this.result.rememberIds
      .filter((rememberId) => !this.sentResult.rememberIds.includes(rememberId))
      .map((rememberId) => ({
        id: rememberId,
        outcome: "correct" as const,
      }));

    const neverResult = this.result.neverIds
      .filter((neverId) => !this.sentResult.neverIds.includes(neverId))
      .map((neverId) => ({
        id: neverId,
        outcome: "never" as const,
      }));

    return [...forgotResult, ...rememberResult, ...neverResult];
  }

  async submitFinished(onReviewSuccess?: () => void) {
    if (!this.hasResult) {
      screenStore.go({ type: "main" });
      return;
    }

    const result = await this.reviewCardsRequest.execute({
      cards: this.cardsToSend,
      isStudyAnyway: this.isStudyAnyway,
    });
    if (result.status === "error") {
      notifyError({ e: result.error, info: "Error submitting review" });
      return;
    }
    onReviewSuccess?.();
    hapticNotification("success");
  }
}
