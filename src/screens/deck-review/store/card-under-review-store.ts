import { makeAutoObservable } from "mobx";
import {
  CardAnswerDbType,
  DeckCardDbType,
  DeckSpeakFieldEnum,
} from "../../../../functions/db/deck/decks-with-cards-schema.ts";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";
import { speak, SpeakLanguageEnum } from "../../../lib/voice-playback/speak.ts";
import { isEnumValid } from "../../../lib/typescript/is-enum-valid.ts";
import { CardAnswerType } from "../../../../functions/db/custom-types.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { userStore } from "../../../store/user-store.ts";
import { BooleanToggle } from "../../../lib/mobx-form/boolean-toggle.ts";
import { CardReviewType } from "../../../../functions/db/deck/get-cards-to-review-db.ts";

export enum CardState {
  Remember = "remember",
  Forget = "forget",
}

export class CardUnderReviewStore {
  id: number;
  front: string;
  back: string;
  example: string | null = null;
  deckName?: string;
  deckSpeakLocale: string | null = null;
  deckSpeakField: DeckSpeakFieldEnum | null = null;
  answerType: CardAnswerType;
  answers: CardAnswerDbType[] = [];
  answer?: CardAnswerDbType;

  isOpened = false;
  state?: CardState;

  // A hack for iOS when the card content is too large
  isOverflowing = new BooleanToggle(false);

  constructor(
    card: DeckCardDbType,
    deck: DeckWithCardsWithReviewType,
    public cardReviewType: CardReviewType,
  ) {
    this.id = card.id;
    this.front = card.front;
    this.back = card.back;
    this.example = card.example;
    this.answerType = card.answer_type;
    this.answers = card.answers || [];
    this.deckName = deck.name;
    this.deckSpeakLocale = deck.speak_locale;
    this.deckSpeakField = deck.speak_field;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  open() {
    this.isOpened = true;
  }

  openWithAnswer(answer: CardAnswerDbType) {
    this.open();
    assert(this.answerType === "choice_single");
    this.answer = answer;
  }

  close() {
    this.isOpened = false;
  }

  changeState(state: CardState) {
    if (!this.isOpened) {
      this.isOpened = true;
    }
    this.state = state;
  }

  speak() {
    if (
      !userStore.isSpeakingCardsEnabled ||
      !this.deckSpeakLocale ||
      !this.deckSpeakField
    ) {
      return;
    }

    if (!isEnumValid(this.deckSpeakLocale, SpeakLanguageEnum)) {
      return;
    }

    const text = this[this.deckSpeakField];

    speak(removeAllTags(text), this.deckSpeakLocale);
  }
}
