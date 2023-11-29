import { makeAutoObservable } from "mobx";
import { assert } from "../lib/typescript/assert.ts";
import { DeckCardDbType } from "../../functions/db/deck/decks-with-cards-schema.ts";
import { DeckWithCardsWithReviewType } from "./deck-list-store.ts";
import { speak, SpeakLanguageEnum } from "../lib/voice-playback/speak.ts";
import { isEnumValid } from "../lib/typescript/is-enum-valid.ts";

export enum CardState {
  Remember = "remember",
  Forget = "forget",
}

export enum DeckSpeakField {
  Front = "front",
  Back = "back",
}

export class CardUnderReviewStore {
  id: number;
  front: string;
  back: string;
  example: string | null = null;
  deckName?: string;
  deckId?: number;
  deckSpeakLocale: string | null = null;
  deckSpeakField: string | null = null;

  isOpened = false;
  state?: CardState;

  constructor(card: DeckCardDbType, deck: DeckWithCardsWithReviewType) {
    this.id = card.id;
    this.front = card.front;
    this.back = card.back;
    this.example = card.example;
    this.deckName = deck.name;
    this.deckId = deck.id;
    this.deckSpeakLocale = deck.speak_locale;
    this.deckSpeakField = deck.speak_field;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  open() {
    this.isOpened = true;
  }

  close() {
    this.isOpened = false;
  }

  changeState(state: CardState) {
    assert(this.isOpened, "The card should be opened before changing state");
    this.state = state;
  }

  speak() {
    if (!this.deckSpeakLocale || !this.deckSpeakField) {
      return;
    }
    if (
      !isEnumValid(this.deckSpeakField, DeckSpeakField) ||
      !isEnumValid(this.deckSpeakLocale, SpeakLanguageEnum)
    ) {
      return;
    }

    speak(this[this.deckSpeakField], this.deckSpeakLocale);
  }
}
