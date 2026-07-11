import { CardPreviewFormData } from "./store/card-preview-types.ts";
import { BooleanField, TextField } from "mobx-form-lite";
import { createAnswerListField } from "../deck-form/store/deck-form-store.ts";
import { DeckCardDbType } from "api";
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
      answerType: new TextField<DeckCardDbType["answerType"]>(
        card.answerType || "remember",
      ),
      options: new TextField<DeckCardDbType["options"]>(card.options || null),
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
