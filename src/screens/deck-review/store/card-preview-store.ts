import { LimitedCardUnderReviewStore } from "../../shared/card/card.tsx";
import {
  CardAnswerDbType,
  DeckSpeakFieldEnum,
} from "../../../../functions/db/deck/decks-with-cards-schema.ts";
import { CardAnswerType } from "../../../../functions/db/custom-types.ts";
import { makeAutoObservable } from "mobx";
import { userStore } from "../../../store/user-store.ts";
import { isEnumValid } from "../../../lib/typescript/is-enum-valid.ts";
import {
  isSpeechSynthesisSupported,
  speak,
  SpeakLanguageEnum,
} from "../../../lib/voice-playback/speak.ts";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { CardFormStoreInterface } from "../../deck-form/deck-form/store/card-form-store-interface.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { BooleanToggle } from "mobx-form-lite";

export class CardPreviewStore implements LimitedCardUnderReviewStore {
  id: number;
  front: string;
  back: string;
  example: string | null = null;
  answerType: CardAnswerType;
  answers: CardAnswerDbType[] = [];
  answer?: CardAnswerDbType;

  voice?: HTMLAudioElement;
  deckSpeakLocale: string | null = null;
  deckSpeakField: DeckSpeakFieldEnum | null = null;

  isOpened = false;

  // A hack for iOS when the card content is too large
  isOverflowing = new BooleanToggle(false);

  constructor(cardFormStore: CardFormStoreInterface) {
    makeAutoObservable(
      this,
      {
        isCardSpeakerVisible: false,
      },
      { autoBind: true },
    );

    const form = cardFormStore.cardForm;
    assert(form, "form is not defined");
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

    const deckForm = cardFormStore.deckForm;
    if (!deckForm) {
      return;
    }

    this.deckSpeakLocale = deckForm.speakingCardsLocale.value ?? null;
    this.deckSpeakField = deckForm.speakingCardsField.value ?? null;

    if (form.options.value?.voice) {
      const audio = new Audio(form.options.value.voice);
      // Preload audio to avoid slow delay when playing voice
      audio.load();
      this.voice = audio;
    }
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

  speak() {
    if (!userStore.isSpeakingCardsEnabled) {
      return;
    }

    if (this.voice) {
      this.voice.play();
      return;
    }

    if (!this.deckSpeakLocale || !this.deckSpeakField) {
      return;
    }

    if (!isEnumValid(this.deckSpeakLocale, SpeakLanguageEnum)) {
      return;
    }

    const text = this[this.deckSpeakField];

    speak(removeAllTags(text), this.deckSpeakLocale);
  }

  isCardSpeakerVisible(type: "front" | "back") {
    if (!userStore.isSpeakingCardsEnabled) {
      return false;
    }

    if (this.voice) {
      return this.isOpened && type === this.deckSpeakField;
    }

    return (
      isSpeechSynthesisSupported &&
      this.isOpened &&
      type === this.deckSpeakField
    );
  }

  get canSpeak() {
    if (this.voice) {
      return true;
    }

    if (!isSpeechSynthesisSupported) {
      return false;
    }
    return Boolean(this.deckSpeakLocale && this.deckSpeakField);
  }
}
