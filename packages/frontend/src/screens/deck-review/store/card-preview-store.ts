import { LimitedCardUnderReviewStore } from "../../shared/card/card.tsx";
import {
  CardAnswerDbType,
  DeckSpeakFieldEnum,
  DEFAULT_EASE_FACTOR,
  DEFAULT_START_INTERVAL,
} from "api";
import { CardAnswerType } from "api";
import { makeAutoObservable } from "mobx";
import { userStore } from "../../../store/user-store.ts";
import { CardFormStoreInterface } from "../../deck-form/deck-form/store/card-form-store-interface.ts";
import {
  createVoicePlayer,
  VoicePlayer,
} from "../voice-player/create-voice-player.ts";
import { assert } from "api";

export class CardPreviewStore implements LimitedCardUnderReviewStore {
  id: number;
  cardReviewType: "new" | "repeat" = "new";
  interval = DEFAULT_START_INTERVAL;
  easeFactor = DEFAULT_EASE_FACTOR;
  isAgain = false;
  front: string;
  back: string;
  example: string | null = null;
  answerType: CardAnswerType;
  answers: CardAnswerDbType[] = [];
  answer?: CardAnswerDbType;

  voicePlayer?: VoicePlayer;
  deckSpeakField: DeckSpeakFieldEnum | null = null;

  isOpened = false;

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

    this.deckSpeakField = deckForm.speakingCardsField.value ?? null;

    const voicePlayer = createVoicePlayer(
      {
        voice: form.options.value?.voice,
        back: form.back.value,
        front: form.front.value,
      },
      {
        speakingCardsLocale: deckForm.speakingCardsLocale.value ?? null,
        speakingCardsField: deckForm.speakingCardsField.value ?? null,
      },
    );

    if (voicePlayer) {
      this.voicePlayer = voicePlayer;
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

    this.voicePlayer?.play();
  }

  isCardSpeakerVisible(type: "front" | "back") {
    if (!userStore.isSpeakingCardsEnabled || !this.voicePlayer) {
      return false;
    }

    return this.isOpened && type === this.deckSpeakField;
  }
}
