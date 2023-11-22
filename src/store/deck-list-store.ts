import { action, makeAutoObservable, runInAction, when } from "mobx";
import { fromPromise, IPromiseBasedObservable } from "mobx-utils";
import {
  addDeckToMineRequest,
  getSharedDeckRequest,
  myInfoRequest,
  removeDeckFromMine,
} from "../api/api.ts";
import { MyInfoResponse } from "../../functions/my-info.ts";
import {
  DeckCardDbType,
  DeckWithCardsDbType,
} from "../../functions/db/deck/decks-with-cards-schema.ts";
import { screenStore } from "./screen-store.ts";
import { CardToReviewDbType } from "../../functions/db/deck/get-cards-to-review-db.ts";
import { assert } from "../lib/typescript/assert.ts";
import { ReviewStore } from "./review-store.ts";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";
import { UserDbType } from "../../functions/db/user/upsert-user-db.ts";

export type DeckWithCardsWithReviewType = DeckWithCardsDbType & {
  cardsToReview: Array<DeckCardDbType & { type: "new" | "repeat" }>;
};

export class DeckListStore {
  myInfo?: IPromiseBasedObservable<MyInfoResponse>;
  isSharedDeckLoading = false;
  isSharedDeckLoaded = false;
  skeletonLoaderData = { publicCount: 3, myDecksCount: 3 };

  isDeckRemoving = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadFirstTime(shareId?: string) {
    this.load();
    this.loadSharedDeck(shareId);
  }

  load() {
    // Stale-while-revalidate approach
    if (this.myInfo) {
      myInfoRequest().then(
        action((result) => {
          this.myInfo = fromPromise(Promise.resolve(result));
        }),
      );
    } else {
      this.myInfo = fromPromise(myInfoRequest());
    }
  }

  async loadSharedDeck(shareId?: string) {
    if (!shareId || this.isSharedDeckLoaded) {
      return;
    }

    this.isSharedDeckLoading = true;
    await when(() => this.myInfo?.state === "fulfilled");

    getSharedDeckRequest(shareId)
      .then(
        action((sharedDeck) => {
          assert(this.myInfo?.state === "fulfilled");
          if (
            this.myInfo.value.myDecks.find(
              (myDeck) => myDeck.id === sharedDeck.deck.id,
            )
          ) {
            screenStore.go({ type: "deckMine", deckId: sharedDeck.deck.id });
            return;
          }

          if (
            this.publicDecks.find(
              (publicDeck) => publicDeck.id === sharedDeck.deck.id,
            )
          ) {
            screenStore.go({ type: "deckPublic", deckId: sharedDeck.deck.id });
            return;
          }

          this.myInfo.value.publicDecks.push(sharedDeck.deck);
          screenStore.go({ type: "deckPublic", deckId: sharedDeck.deck.id });
        }),
      )
      .catch((e) => {
        reportHandledError("Error while retrieving shared deck", e, {
          shareId,
        });
      })
      .finally(
        action(() => {
          this.isSharedDeckLoading = false;
          this.isSharedDeckLoaded = true;
        }),
      );
  }

  get canReview() {
    const deck = this.selectedDeck;
    assert(deck, "canReview requires a deck to be selected");

    return (
      deck.cardsToReview.length > 0 || screenStore.screen.type === "deckPublic"
    );
  }

  startReview(reviewStore: ReviewStore) {
    if (!this.canReview) {
      return;
    }

    assert(deckListStore.selectedDeck, "No selected deck for review");
    if (screenStore.screen.type === "deckPublic") {
      deckListStore.addDeckToMine(deckListStore.selectedDeck.id);
    }

    reviewStore.startDeckReview(
      deckListStore.selectedDeck.cardsToReview,
      deckListStore.selectedDeck.name,
    );
  }

  addDeckToMine(deckId: number) {
    return addDeckToMineRequest({
      deckId,
    })
      .then(() => {
        this.load();
      })
      .catch((error) => {
        reportHandledError("Error while adding deck to mine", error, {
          deckId,
        });
      });
  }

  get myId() {
    if (this.myInfo?.state !== "fulfilled") {
      return null;
    }
    return this.myInfo.value.user.id;
  }

  get selectedDeck(): DeckWithCardsWithReviewType | null {
    const screen = screenStore.screen;
    assert(screen.type === "deckPublic" || screen.type === "deckMine");
    if (!screen.deckId || this.myInfo?.state !== "fulfilled") {
      return null;
    }

    const decksToSearch = this.myInfo.value.myDecks.concat(this.publicDecks);
    const deck = decksToSearch.find((deck) => deck.id === screen.deckId);
    if (!deck) {
      return null;
    }

    const cardsToReview =
      screen.type === "deckPublic"
        ? deck.deck_card.map((card) => ({ ...card, type: "new" as const }))
        : getCardsToReview(deck, this.myInfo.value.cardsToReview);

    return {
      ...deck,
      cardsToReview: cardsToReview,
    };
  }

  get publicDecks() {
    if (this.myInfo?.state !== "fulfilled") {
      return [];
    }
    const myDeckIds = this.myInfo.value.myDecks.map((deck) => deck.id);
    return this.myInfo.value.publicDecks.filter(
      (publicDeck) => !myDeckIds.includes(publicDeck.id),
    );
  }

  get myDecks(): DeckWithCardsWithReviewType[] {
    if (this.myInfo?.state !== "fulfilled") {
      return [];
    }
    const cardsToReview = this.myInfo.value.cardsToReview;

    return this.myInfo.value.myDecks.map((deck) => ({
      ...deck,
      cardsToReview: getCardsToReview(deck, cardsToReview),
    }));
  }

  get areAllDecksReviewed() {
    return (
      this.myDecks.length > 0 &&
      this.myDecks.every((deck) => deck.cardsToReview.length === 0)
    );
  }

  async removeDeck() {
    const deck = this.selectedDeck;
    if (!deck) {
      return;
    }

    this.isDeckRemoving = true;

    try {
      await removeDeckFromMine({ deckId: deck.id });
      screenStore.go({ type: "main" });
      this.myInfo = fromPromise(myInfoRequest());
    } catch (e) {
      reportHandledError(`Unable to remove deck ${deck.id}`, e);
    } finally {
      runInAction(() => {
        this.isDeckRemoving = false;
      });
    }
  }

  optimisticUpdateSettings(
    body: Pick<UserDbType, "is_remind_enabled" | "last_reminded_date">,
  ) {
    assert(this.myInfo?.state === "fulfilled");
    Object.assign(this.myInfo.value.user, body);
  }
}

const getCardsToReview = (
  deck: DeckWithCardsDbType,
  cardsToReview: CardToReviewDbType[],
) => {
  const map = new Map<number, "new" | "repeat">();

  cardsToReview.forEach((cardToReview) => {
    if (cardToReview.deck_id == deck.id) {
      map.set(cardToReview.id, cardToReview.type);
    }
  });

  return deck.deck_card
    .filter((card) => map.has(card.id))
    .map((card) => ({
      ...card,
      type: map.get(card.id)!,
    }))
    .slice()
    .sort((card) => (card.type === "repeat" ? -1 : 1));
};

export const deckListStore = new DeckListStore();
