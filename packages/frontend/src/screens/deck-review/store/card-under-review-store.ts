import { makeAutoObservable } from "mobx";
import {
  ReviewOutcome,
  type CardAnswerDbType,
  type DeckSpeakFieldEnum,
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
import { DateTime } from "luxon";
import { preloadCardImage } from "../../../lib/card-image/image-preloader.ts";

export class CardUnderReviewStore implements LimitedCardUnderReviewStore {
  id: number;
  cardReviewType: CardReviewType;
  interval: number;
  easeFactor: number;
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
    this.interval = card.interval;
    this.easeFactor = card.easeFactor;
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
    this.open();
    assert(this.answerType === "choice_single");
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
    const result = reviewCard(
      DateTime.now(),
      this.interval,
      outcome,
      this.easeFactor,
    );
    this.interval = result.interval;
    this.easeFactor = result.easeFactor;
    if (outcome === "again") {
      this.isAgain = true;
    }
  }
}
