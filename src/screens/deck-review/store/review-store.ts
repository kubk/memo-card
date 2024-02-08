import { CardState, CardUnderReviewStore } from "./card-under-review-store.ts";
import { action, makeAutoObservable } from "mobx";
import { assert } from "../../../lib/typescript/assert.ts";
import { reviewCardsRequest } from "../../../api/api.ts";
import { ReviewOutcome } from "../../../../functions/services/review-card.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { type DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";
import {
  hapticImpact,
  hapticNotification,
} from "../../../lib/telegram/haptics.ts";
import { showConfirm } from "../../../lib/telegram/show-confirm.ts";
import { t } from "../../../translations/t.ts";

type ReviewResult = {
  forgotIds: number[];
  rememberIds: number[];
  neverIds: number[];
};

export class ReviewStore {
  cardsToReview: CardUnderReviewStore[] = [];
  currentCardId?: number;

  result: ReviewResult = { forgotIds: [], rememberIds: [], neverIds: [] };
  initialCardCount?: number;

  isReviewSending = false;
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
    deck.deck_card.forEach((card) => {
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

    return reviewCardsRequest({
      cards: this.cardsToSend,
      isInterrupted: true,
      isStudyAnyway: this.isStudyAnyway,
    });
  }

  get cardsToSend(): Array<{ id: number; outcome: ReviewOutcome }> {
    return [
      ...this.result.forgotIds.map((forgotId) => ({
        id: forgotId,
        outcome: "wrong" as const,
      })),
      ...this.result.rememberIds.map((rememberId) => ({
        id: rememberId,
        outcome: "correct" as const,
      })),
      ...this.result.neverIds.map((neverId) => ({
        id: neverId,
        outcome: "never" as const,
      })),
    ];
  }

  async submitFinished(onReviewSuccess?: () => void) {
    if (!this.hasResult) {
      screenStore.go({ type: "main" });
      return;
    }

    this.isReviewSending = true;

    return reviewCardsRequest({
      cards: this.cardsToSend,
      isStudyAnyway: this.isStudyAnyway,
    }).finally(
      action(() => {
        onReviewSuccess?.();
        hapticNotification("success");
        this.isReviewSending = false;
      }),
    );
  }
}
