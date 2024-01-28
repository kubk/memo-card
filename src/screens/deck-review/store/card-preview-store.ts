import { LimitedCardUnderReviewStore } from "../../shared/card/card.tsx";
import {
  CardAnswerDbType,
  DeckSpeakFieldEnum,
} from "../../../../functions/db/deck/decks-with-cards-schema.ts";
import { CardAnswerType } from "../../../../functions/db/custom-types.ts";
import {
  CardFormType,
  DeckFormStore,
} from "../../deck-form/store/deck-form-store.ts";
import { makeAutoObservable } from "mobx";
import { userStore } from "../../../store/user-store.ts";
import { isEnumValid } from "../../../lib/typescript/is-enum-valid.ts";
import { SpeakLanguageEnum, speak } from "../../../lib/voice-playback/speak.ts";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";

export class CardPreviewStore implements LimitedCardUnderReviewStore {
  id: number;
  front: string;
  back: string;
  example: string | null = null;
  answerType: CardAnswerType;
  answers: CardAnswerDbType[] = [];
  answer?: CardAnswerDbType;

  deckSpeakLocale: string | null = null;
  deckSpeakField: DeckSpeakFieldEnum | null = null;

  isOpened = false;

  constructor(form: CardFormType, deckFormStore?: DeckFormStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.id = 9999;
    this.front = form.front.value;
    this.back = form.back.value;
    this.answerType = form.answerType.value;
    this.example = form.example.value;
    this.answers = form.answers.value.map((answer) => ({
      id: answer.id,
      text: answer.text.value,
      isCorrect: answer.isCorrect.value,
    }));

    if (!deckFormStore) {
      return;
    }

    this.deckSpeakLocale =
      deckFormStore.form?.speakingCardsLocale.value ?? null;
    this.deckSpeakField = deckFormStore.form?.speakingCardsField.value ?? null;
  }

  speak() {
    if (
      !this.isSpeakingCardsEnabledSettings ||
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

  get isSpeakingCardsEnabledSettings() {
    return userStore.isSpeakingCardsEnabled;
  }

  openWithAnswer(answer: CardAnswerDbType) {
    this.isOpened = true;
    this.answer = answer;
  }

  revert() {
    this.isOpened = false;
    this.answer = undefined;
  }

  open() {
    this.isOpened = true;

    if (this.answerType === "remember") {
      this.speak();
    }
  }
}
