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
import { t } from "../../../translations/t.ts";

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

  get isInCollection() {
    return deckListStore.isItemInCollection({ type: "deck", id: this.deckId });
  }

  get isLoadingOrAdding() {
    return (
      this.isInitialLoading ||
      deckListStore.isAddProgressVisible({ type: "deck", id: this.deckId })
    );
  }

  get mainButtonText() {
    return this.isInCollection ? t("review_deck") : t("add_to_collection");
  }

  get isMainButtonVisible() {
    return this.isInCollection ? this.canReview : !!this.deck;
  }

  onMainButtonClick(reviewStore: ReviewStore) {
    if (this.isInCollection) {
      this.startReview(reviewStore);
    } else {
      deckListStore.addToCollection({ type: "deck", id: this.deckId });
    }
  }

  get canReview() {
    const deck = this.deck;
    return !!deck && this.isInCollection && deck.cardsToReview.length > 0;
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

  openCard(cardId: number) {
    const deck = this.deck;
    if (!deck) {
      return;
    }

    if (this.canEdit) {
      screenStore.push({
        type: "deckForm",
        deckId: deck.id,
        cardId,
      });
      return;
    }

    screenStore.push({
      type: "cardPreviewId",
      cardId,
      deckId: deck.id,
    });
  }

  startReview(
    reviewStore: ReviewStore,
    filter?: (card: DeckCardDbTypeWithType) => boolean,
  ) {
    const deck = this.deck;
    if (!deck || !this.canReview) {
      return;
    }

    reviewStore.startDeckReview(deck, filter);
  }
}
