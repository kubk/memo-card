import { LimitedCardUnderReviewStore } from "../../shared/card/card.tsx";
import {
  CardAnswerDbType,
  DeckSpeakFieldEnum,
} from "../../../../functions/db/deck/decks-with-cards-schema.ts";
import { CardAnswerType } from "../../../../functions/db/custom-types.ts";
import { CardFormType } from "../../deck-form/store/deck-form-store.ts";
import { makeAutoObservable } from "mobx";

export class CardPreviewStore implements LimitedCardUnderReviewStore {
  id: number;
  front: string;
  back: string;
  example: string | null = null;
  deckSpeakField: DeckSpeakFieldEnum | null = null;
  answerType: CardAnswerType;
  answers: CardAnswerDbType[] = [];
  answer?: CardAnswerDbType;

  isOpened = false;

  isSpeakingCardsEnabledSettings = false;

  constructor(form: CardFormType) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.id = 9999;
    this.front = form.front.value;
    this.back = form.back.value;
    this.answerType = form.answerType.value;
    this.answers = form.answers.value.map((answer) => ({
      id: answer.id,
      text: answer.text.value,
      isCorrect: answer.isCorrect.value,
    }));
  }

  speak() {}

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
  }
}
