import { createInitialFsrsReviewState } from "api";
import { makeAutoObservable } from "mobx";
import { api } from "../../../api/trpc-api.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import {
  type DeckCardDbTypeWithType,
  type DeckListDeck,
  type DeckWithCardsWithReviewType,
  deckListStore,
} from "../../../store/deck-list-store.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { userStore } from "../../../store/user-store.ts";
import { type ReviewStore } from "./review-store.ts";

const getNewCardsToReview = (deck: DeckListDeck): DeckCardDbTypeWithType[] =>
  deck.deckCards.map((card) => ({
    ...card,
    type: "new",
    ...createInitialFsrsReviewState(new Date()),
  }));

export class DeckScreenStore {
  detailsQuery;

  constructor(private deckId: number) {
    this.detailsQuery = makeQuery({
      key: `deck.details:${deckId}`,
      query: () => api.deck.deckWithCards.query({ deckId }),
    });
    makeAutoObservable<this, "deckId">(
      this,
      { deckId: false },
      { autoBind: true },
    );
  }

  get ownedDeck(): DeckWithCardsWithReviewType | null {
    return (
      deckListStore.myDecks.find((deck) => deck.id === this.deckId) ?? null
    );
  }

  get previewDeck() {
    const deck = screenStore.screen.state?.deck;
    return deck?.id === this.deckId ? deck : null;
  }

  get deck(): DeckWithCardsWithReviewType | null {
    if (this.ownedDeck) {
      return this.ownedDeck;
    }

    const deck =
      this.detailsQuery.data ??
      this.previewDeck ??
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
    if (this.ownedDeck) {
      return false;
    }

    return this.detailsQuery.isPending;
  }

  get canReview() {
    const deck = this.deck;
    return !!deck && (deck.cardsToReview.length > 0 || !this.ownedDeck);
  }

  get canEdit() {
    return this.deck?.authorId === userStore.myId;
  }

  startReview(reviewStore: ReviewStore) {
    const deck = this.deck;
    if (!deck || !this.canReview) {
      return;
    }

    if (!this.ownedDeck) {
      deckListStore.addDeckToMine(deck.id);
    }

    reviewStore.startDeckReview(deck);
  }
}
