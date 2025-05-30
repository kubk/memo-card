import { makeAutoObservable } from "mobx";
import {
  type CardAnswerDbType,
  type DeckCardDbType,
  type DeckSpeakFieldEnum,
} from "api";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";
import { CardAnswerType } from "api";
import { userStore } from "../../../store/user-store.ts";
import { BooleanToggle } from "mobx-form-lite";
import { CardReviewType } from "api";
import { LimitedCardUnderReviewStore } from "../../shared/card/card.tsx";
import {
  createVoicePlayer,
  VoicePlayer,
} from "../voice-player/create-voice-player.ts";
import { assert } from "api";

export enum CardState {
  Remember = "remember",
  Forget = "forget",
  Never = "never",
}

export class CardUnderReviewStore implements LimitedCardUnderReviewStore {
  id: number;
  front: string;
  back: string;
  example: string | null = null;
  deckName?: string;
  voicePlayer?: VoicePlayer;
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
    this.deckSpeakField = deck.speak_field;

    const voicePlayer = createVoicePlayer(
      {
        voice: card.options?.voice,
        back: card.back,
        front: card.front,
      },
      {
        speakingCardsField: deck.speak_field,
        speakingCardsLocale: deck.speak_locale,
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

  changeState(state: CardState) {
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
}
