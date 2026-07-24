import { createInitialFsrsReviewState } from "api";
import { makeAutoObservable } from "mobx";
import {
  type DeckCardDbTypeWithType,
  type DeckWithCardsWithReviewType,
  deckListStore,
} from "../../../store/deck-list-store.ts";
import { type DeckListDeck } from "../../../store/deck-types.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { type ReviewStore } from "./review-store.ts";
import { deckDetailsStore } from "../../../store/deck-details-store.ts";

const getNewCardsToReview = (deck: DeckListDeck): DeckCardDbTypeWithType[] =>
  deck.deckCards.map((card) => ({
    ...card,
    type: "new",
    ...createInitialFsrsReviewState(new Date()),
  }));

export class DeckScreenStore {
  detailsQuery;

  constructor(private deckId: number) {
    this.detailsQuery = deckDetailsStore.getQuery(deckId);
    makeAutoObservable<this, "deckId">(
      this,
      { deckId: false },
      { autoBind: true },
    );
  }

  get libraryDeck(): DeckWithCardsWithReviewType | null {
    return (
      deckListStore.myDecks.find((deck) => deck.id === this.deckId) ?? null
    );
  }

  get deck(): DeckWithCardsWithReviewType | null {
    if (this.libraryDeck) {
      return this.libraryDeck;
    }

    const deck =
      this.detailsQuery.data ??
      deckListStore.publicDecks.find((item) => item.id === this.deckId);
    if (!deck) {
      return null;
    }

    return {
      ...deck,
      cardsToReview: getNewCardsToReview(deck),
    };
  }

  get isInitialLoading() {
    if (this.libraryDeck) {
      return false;
    }

    return this.detailsQuery.isPending;
  }

  get canReview() {
    const deck = this.deck;
    return !!deck && (deck.cardsToReview.length > 0 || !this.libraryDeck);
  }

  get canEdit() {
    const deck = this.deck;
    return !!deck && deckListStore.isDeckOwner(deck);
  }

  openCardList() {
    const deck = this.deck;
    if (!deck) {
      return;
    }

    deckDetailsStore.setDeck(deck);
    screenStore.push(
      this.canEdit
        ? {
            type: "cardList",
            deckId: deck.id,
          }
        : {
            type: "cardListPreview",
            deckId: deck.id,
          },
    );
  }

  startReview(reviewStore: ReviewStore) {
    const deck = this.deck;
    if (!deck || !this.canReview) {
      return;
    }

    if (!this.libraryDeck) {
      deckListStore.addDeckToMine(deck.id);
    }

    reviewStore.startDeckReview(deck);
  }
}
