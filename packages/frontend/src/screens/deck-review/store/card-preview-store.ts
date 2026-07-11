import { LimitedCardUnderReviewStore } from "../../shared/card/card.tsx";
import {
  DeckCardDbType,
  DeckWithCardsDbType,
  createInitialFsrsReviewState,
  type FsrsState,
} from "api";
import { makeAutoObservable } from "mobx";
import { userStore } from "../../../store/user-store.ts";
import { CardPreviewFormData } from "../../deck-form/card-form/store/card-preview-types.ts";
import {
  createVoicePlayer,
  VoicePlayer,
} from "../voice-player/create-voice-player.ts";
import { assert } from "api";
import { platform } from "../../../lib/platform/platform.ts";

type CardAnswer = NonNullable<DeckCardDbType["answers"]>[number];

export class CardPreviewStore implements LimitedCardUnderReviewStore {
  id: number;
  cardReviewType: "new" | "repeat" = "new";
  due: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  fsrsState: FsrsState;
  lastReviewDate: string | null;
  isAgain = false;
  front: string;
  back: string;
  example: string | null = null;
  answerType: DeckCardDbType["answerType"];
  answers: CardAnswer[] = [];
  answer?: CardAnswer;

  voicePlayer?: VoicePlayer;
  deckSpeakField: DeckWithCardsDbType["speakField"] = null;

  isOpened = false;

  constructor(cardFormStore: CardPreviewFormData) {
    const reviewState = createInitialFsrsReviewState(new Date());
    this.due = reviewState.due;
    this.stability = reviewState.stability;
    this.difficulty = reviewState.difficulty;
    this.elapsedDays = reviewState.elapsedDays;
    this.scheduledDays = reviewState.scheduledDays;
    this.learningSteps = reviewState.learningSteps;
    this.reps = reviewState.reps;
    this.lapses = reviewState.lapses;
    this.fsrsState = reviewState.fsrsState;
    this.lastReviewDate = reviewState.lastReviewDate;

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

    // Use card-level speakField override if provided, otherwise use deck default
    this.deckSpeakField =
      form.options.value?.speakField ??
      cardFormStore.speakingCardsField ??
      null;

    const voicePlayer = createVoicePlayer(
      {
        voice: form.options.value?.voice,
        speakField: form.options.value?.speakField,
        back: form.back.value,
        front: form.front.value,
      },
      {
        speakingCardsLocale: cardFormStore.speakingCardsLocale,
        speakingCardsField: cardFormStore.speakingCardsField,
      },
    );

    if (voicePlayer) {
      this.voicePlayer = voicePlayer;
    }
  }

  openWithAnswer(answer: CardAnswer) {
    platform.haptic(answer.isCorrect ? "light" : "medium");
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
