import {
  CardFormStoreInterface,
  CardInnerScreenType,
} from "../deck-form/store/card-form-store-interface.ts";
import { ListField, TextField } from "mobx-form-lite";
import { CardAnswerType } from "../../../../functions/db/custom-types.ts";
import { CardAnswerFormType } from "../deck-form/store/deck-form-store.ts";
import { DeckCardOptionsDbType } from "../../../../functions/db/deck/decks-with-cards-schema.ts";

export const createMockCardPreviewForm = (card: {
  front: string;
  back: string;
  example?: string;
}): CardFormStoreInterface => {
  return {
    cardForm: {
      front: new TextField<string>(card.front),
      back: new TextField<string>(card.back),
      example: new TextField<string>(card.example ?? ""),
      answerType: new TextField<CardAnswerType>("remember"),
      answerFormType: "new",
      options: new TextField<DeckCardOptionsDbType>(null),
      answers: new ListField<CardAnswerFormType>([]),
      answerId: "0",
    },
    deckForm: undefined,
    cardInnerScreen: new TextField<CardInnerScreenType>(null),
    onBackCard: () => {},
    onSaveCard: () => {},
    isSending: false,
    markCardAsRemoved: () => {},
  };
};
