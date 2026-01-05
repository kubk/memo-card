import { CardPreviewFormData } from "./store/card-preview-types.ts";
import { BooleanField, TextField } from "mobx-form-lite";
import { CardAnswerType } from "api";
import { createAnswerListField } from "../deck-form/store/deck-form-store.ts";
import { DeckCardDbType, DeckCardOptionsDbType } from "api";
import { DeckWithCardsWithReviewType } from "../../../store/deck-list-store.ts";

type CardPreviewType = Omit<DeckCardDbType, "id" | "createdAt" | "deckId">;

type DeckPreviewType = Pick<
  DeckWithCardsWithReviewType,
  "speakLocale" | "speakField"
>;

export const createMockCardPreviewForm = (
  card: CardPreviewType,
  deck?: DeckPreviewType,
): CardPreviewFormData => {
  return {
    speakingCardsLocale: deck?.speakLocale ?? null,
    speakingCardsField: deck?.speakField ?? null,
    cardForm: {
      front: new TextField<string>(card.front),
      back: new TextField<string>(card.back),
      example: new TextField<string>(card.example ?? ""),
      answerType: new TextField<CardAnswerType>(card.answerType || "remember"),
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
    },
  };
};
