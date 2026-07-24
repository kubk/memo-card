import { type RouterOutput } from "api";

type MyInfoResponse = RouterOutput["me"]["info"];

export type DeckListDeck = MyInfoResponse["myDecks"][number] & {
  deckCategory?: MyInfoResponse["publicDecks"][number]["deckCategory"];
};
