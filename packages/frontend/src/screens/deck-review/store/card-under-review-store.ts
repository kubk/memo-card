import { makeAutoObservable } from "mobx";
import {
  ReviewOutcome,
  type CardAnswerDbType,
  type DeckSpeakFieldEnum,
  type FsrsState,
  reviewCard,
} from "api";
import {
  DeckWithCardsWithReviewType,
  DeckCardDbTypeWithType,
} from "../../../store/deck-list-store.ts";
import { CardAnswerType } from "api";
import { userStore } from "../../../store/user-store.ts";
import { CardReviewType } from "api";
import { LimitedCardUnderReviewStore } from "../../shared/card/card.tsx";
import {
  createVoicePlayer,
  VoicePlayer,
} from "../voice-player/create-voice-player.ts";
import { assert } from "api";
import { preloadCardImage } from "../../../lib/card-image/image-preloader.ts";
import { platform } from "../../../lib/platform/platform.ts";

export class CardUnderReviewStore implements LimitedCardUnderReviewStore {
  id: number;
  cardReviewType: CardReviewType;
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
  front: string;
  back: string;
  example: string | null = null;
  deckName?: string;
  voicePlayer?: VoicePlayer;
  deckSpeakField: DeckSpeakFieldEnum | null = null;
  answerType: CardAnswerType;
  answers: CardAnswerDbType[] = [];
  answer?: CardAnswerDbType;

  // Used to avoid showing "easy" temporarily
  isAgain = false;

  isOpened = false;
  state?: ReviewOutcome;

  constructor(card: DeckCardDbTypeWithType, deck: DeckWithCardsWithReviewType) {
    this.id = card.id;
    this.cardReviewType = card.type;
    this.due = card.due;
    this.stability = card.stability;
    this.difficulty = card.difficulty;
    this.elapsedDays = card.elapsedDays;
    this.scheduledDays = card.scheduledDays;
    this.learningSteps = card.learningSteps;
    this.reps = card.reps;
    this.lapses = card.lapses;
    this.fsrsState = card.fsrsState;
    this.lastReviewDate = card.lastReviewDate;
    this.front = card.front;
    this.back = card.back;
    this.example = card.example;
    this.answerType = card.answerType;
    this.answers = card.answers || [];
    this.deckName = deck.name;
    // Use card-level speakField override if provided, otherwise use deck default
    this.deckSpeakField = card.options?.speakField || deck.speakField;

    preloadCardImage(card);

    const voicePlayer = createVoicePlayer(
      {
        voice: card.options?.voice,
        speakField: card.options?.speakField,
        back: card.back,
        front: card.front,
      },
      {
        speakingCardsField: deck.speakField,
        speakingCardsLocale: deck.speakLocale,
      },
    );

    if (voicePlayer) {
      this.voicePlayer = voicePlayer;
    }

    makeAutoObservable(
      this,
      { isCardSpeakerVisible: false },
      { autoBind: true },
    );
  }

  open() {
    this.isOpened = true;
  }

  openWithAnswer(answer: CardAnswerDbType) {
    assert(this.answerType === "choice_single");
    platform.haptic(answer.isCorrect ? "light" : "medium");
    this.open();
    this.answer = answer;
    this.speak();
  }

  close() {
    this.isOpened = false;
  }

  changeState(state: ReviewOutcome) {
    if (!this.isOpened) {
      this.isOpened = true;
    }
    this.state = state;
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

  updateAfterReview(outcome: ReviewOutcome) {
    const result = reviewCard(new Date(), this, outcome);
    this.due = result.due;
    this.stability = result.stability;
    this.difficulty = result.difficulty;
    this.elapsedDays = result.elapsedDays;
    this.scheduledDays = result.scheduledDays;
    this.learningSteps = result.learningSteps;
    this.reps = result.reps;
    this.lapses = result.lapses;
    this.fsrsState = result.fsrsState;
    this.lastReviewDate = result.lastReviewDate;
    if (outcome === "again") {
      this.isAgain = true;
    }
  }
}
