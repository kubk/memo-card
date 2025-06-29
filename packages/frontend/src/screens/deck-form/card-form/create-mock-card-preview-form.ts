import {
  CardFormStoreInterface,
  CardInnerScreenType,
} from "../deck-form/store/card-form-store-interface.ts";
import { BooleanField, TextField } from "mobx-form-lite";
import { CardAnswerType } from "api";
import { createAnswerListField } from "../deck-form/store/deck-form-store.ts";
import { DeckCardDbType, DeckCardOptionsDbType, DeckSpeakFieldEnum } from "api";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";

type CardPreviewType = Omit<DeckCardDbType, "id" | "createdAt" | "deckId">;

type DeckPreviewType = Pick<
  DeckWithCardsWithReviewType,
  "speakLocale" | "speakField" | "cardInputModeId"
>;

export const createMockCardPreviewForm = (
  card: CardPreviewType,
  deck?: DeckPreviewType,
): CardFormStoreInterface => {
  return {
    deckForm: deck
      ? {
          speakingCardsLocale: new TextField<string | null>(deck.speakLocale),
          speakingCardsField: new TextField<DeckSpeakFieldEnum | null>(
            deck.speakField,
          ),
          cardInputModeId: deck.cardInputModeId || null,
        }
      : undefined,
    cardForm: {
      front: new TextField<string>(card.front),
      back: new TextField<string>(card.back),
      example: new TextField<string>(card.example ?? ""),
      answerType: new TextField<CardAnswerType>(card.answerType || "remember"),
      answerFormType: "new",
      options: new TextField<DeckCardOptionsDbType>(card.options || null),
      answers: createAnswerListField(
        card.answers
          ? card.answers.map((answer) => ({
              id: answer.id,
              text: new TextField(answer.text),
              isCorrect: new BooleanField(answer.isCorrect),
            }))
          : [],
        () => null,
      ),
      answerId: "0",
    },
    cardInnerScreen: new TextField<CardInnerScreenType>(null),
    onBackCard: () => {},
    onSaveCard: () => {},
    isSending: false,
    markCardAsRemoved: () => {},
  };
};
