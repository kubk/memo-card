import { api } from "../api/trpc-api.ts";
import { makeQuery } from "../lib/mobx-query-lite/make-query.ts";
import { type DeckListDeck } from "./deck-types.ts";

class DeckDetailsStore {
  getQuery(deckId: number) {
    return makeQuery<DeckListDeck>({
      key: `deck.details:${deckId}`,
      query: () => api.deck.deckWithCards.query({ deckId }),
    });
  }

  setDeck(deck: DeckListDeck) {
    this.getQuery(deck.id).setData(deck);
  }
}

export const deckDetailsStore = new DeckDetailsStore();
