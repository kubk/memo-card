import { makeAutoObservable } from "mobx";
import {
  ReviewOutcome,
  type DeckCardDbType,
  type DeckWithCardsDbType,
  type FsrsState,
  reviewCard,
} from "api";
import {
  DeckWithCardsWithReviewType,
  DeckCardDbTypeWithType,
} from "../../../store/deck-list-store.ts";
import { CardReviewType } from "api";
import { type DeckListDeck } from "../../../store/deck-types.ts";
import { LimitedCardUnderReviewStore } from "../../shared/card/card.tsx";
import {
  createVoicePlayer,
  VoicePlayer,
} from "../voice-player/create-voice-player.ts";
import { assert } from "api";
import { preloadCardImage } from "../../../lib/card-image/image-preloader.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { isCardSpeakerVisible, speakCard } from "./card-speaking.ts";

type CardAnswer = NonNullable<DeckCardDbType["answers"]>[number];

export class CardUnderReviewStore implements LimitedCardUnderReviewStore {
  id: number;
  deckId: number;
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
  deckSpeakField: DeckWithCardsDbType["speakField"] = null;
  answerType: DeckCardDbType["answerType"];
  answers: CardAnswer[] = [];
  answer?: CardAnswer;

  // Used to avoid showing "easy" temporarily
  isAgain = false;

  isOpened = false;
  state?: ReviewOutcome;

  constructor(card: DeckCardDbTypeWithType, deck: DeckWithCardsWithReviewType) {
    this.id = card.id;
    this.deckId = card.deckId;
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
    this.deckSpeakField = card.options?.speakField || deck.speakField;

    preloadCardImage(card);
    this.voicePlayer = createCardVoicePlayer(card, deck);

    makeAutoObservable(
      this,
      { isCardSpeakerVisible: false },
      { autoBind: true },
    );
  }

  updateContent(card: DeckCardDbType, deck: DeckListDeck) {
    this.front = card.front;
    this.back = card.back;
    this.example = card.example;
    this.answerType = card.answerType;
    this.answers = card.answers || [];
    this.deckSpeakField = card.options?.speakField || deck.speakField;
    this.voicePlayer = createCardVoicePlayer(card, deck);
  }

  open() {
    this.isOpened = true;
  }

  openWithAnswer(answer: CardAnswer) {
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
    speakCard(this.voicePlayer);
  }

  isCardSpeakerVisible(side: "front" | "back") {
    return isCardSpeakerVisible(this, side);
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

function createCardVoicePlayer(
  card: DeckCardDbType,
  deck: Pick<DeckListDeck, "speakField" | "speakLocale">,
) {
  return (
    createVoicePlayer(
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
    ) ?? undefined
  );
}
