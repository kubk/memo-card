import { CardState, CardUnderReviewStore } from "./card-under-review-store.ts";
import { action, makeAutoObservable } from "mobx";
import { assert } from "../../../lib/typescript/assert.ts";
import { reviewCardsRequest } from "../../../api/api.ts";
import { ReviewOutcome } from "../../../../functions/services/review-card.ts";
import { screenStore } from "../../../store/screen-store.ts";
import {
  deckListStore,
  DeckWithCardsWithReviewType,
} from "../../../store/deck-list-store.ts";

type ReviewResult = {
  forgotIds: number[];
  rememberIds: number[];
};

export class ReviewStore {
  cardsToReview: CardUnderReviewStore[] = [];
  currentCardId?: number;
  // For UI purposes
  nextCardId?: number;

  result: ReviewResult = { forgotIds: [], rememberIds: [] };
  initialCardCount?: number;

  isReviewSending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  startDeckReview(
    deck: DeckWithCardsWithReviewType,
    isSpeakingCardsEnabledSettings?: boolean,
  ) {
    if (!deck.cardsToReview.length) {
      return;
    }
    deck.cardsToReview.forEach((card) => {
      this.cardsToReview.push(
        new CardUnderReviewStore(card, deck, !!isSpeakingCardsEnabledSettings),
      );
    });

    this.initializeInitialCurrentNextCards();
  }

  startFolderReview(
    myDecks: DeckWithCardsWithReviewType[],
    isSpeakingCardsEnabledSettings?: boolean,
  ) {
    if (!myDecks.length) {
      return;
    }

    myDecks.forEach((deck) => {
      deck.cardsToReview.forEach((card) => {
        this.cardsToReview.push(
          new CardUnderReviewStore(
            card,
            deck,
            !!isSpeakingCardsEnabledSettings,
          ),
        );
      });
    });

    this.initializeInitialCurrentNextCards();
  }

  startAllRepeatReview(
    myDecks: DeckWithCardsWithReviewType[],
    isSpeakingCardsEnabledSettings?: boolean,
  ) {
    if (!myDecks.length) {
      return;
    }

    myDecks.forEach((deck) => {
      deck.cardsToReview
        .filter((card) => card.type === "repeat")
        .forEach((card) => {
          this.cardsToReview.push(
            new CardUnderReviewStore(
              card,
              deck,
              !!isSpeakingCardsEnabledSettings,
            ),
          );
        });
    });

    this.initializeInitialCurrentNextCards();
  }

  private initializeInitialCurrentNextCards() {
    if (!this.cardsToReview.length) {
      return;
    }

    this.initialCardCount = this.cardsToReview.length;
    this.currentCardId = this.cardsToReview[0].id;
    if (this.cardsToReview.length > 1) {
      this.nextCardId = this.cardsToReview[1].id;
    }
  }

  get currentCard() {
    if (!this.currentCardId) {
      return null;
    }

    return (
      this.cardsToReview.find((card) => this.currentCardId === card.id) || null
    );
  }

  get nextCard() {
    if (!this.nextCardId) {
      return null;
    }

    return (
      this.cardsToReview.find((card) => this.nextCardId === card.id) || null
    );
  }

  open() {
    const currentCard = this.currentCard;
    assert(currentCard, "Current card should not be empty");
    currentCard.open();
    currentCard.speak();
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
      this.cardsToReview.push(currentCard);
    }

    if (
      currentCard.state === CardState.Remember &&
      !this.result.forgotIds.includes(currentCard.id)
    ) {
      this.result.rememberIds.push(currentCard.id);
    }

    if (this.cardsToReview.length !== 0) {
      // Go to next card
      this.currentCardId = this.cardsToReview[0].id;
      this.nextCardId =
        this.cardsToReview.length > 1 ? this.cardsToReview[1].id : undefined;
    }
  }

  get isFinished() {
    return this.cardsToReview.length === 0 && this.hasResult;
  }

  get hasResult() {
    return this.result.forgotIds.length || this.result.rememberIds.length;
  }

  submitUnfinished() {
    screenStore.go({ type: "main" });

    if (!this.hasResult) {
      return;
    }

    return reviewCardsRequest({ cards: this.cardsToSend, isInterrupted: true });
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
    ];
  }

  async submitFinished() {
    if (!this.hasResult) {
      screenStore.go({ type: "main" });
      return;
    }

    this.isReviewSending = true;

    return reviewCardsRequest({ cards: this.cardsToSend }).finally(
      action(() => {
        deckListStore.load();
        this.isReviewSending = false;
      }),
    );
  }
}
