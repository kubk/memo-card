import {
  CardFormStoreInterface,
  CardInnerScreenType,
} from "./store/card-form-store-interface.ts";
import { ListField, TextField } from "mobx-form-lite";
import { CardAnswerType } from "../../../functions/db/custom-types.ts";
import { CardAnswerFormType } from "./store/deck-form-store.ts";

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
      options: null,
      answers: new ListField<CardAnswerFormType>([]),
      answerId: "0",
    },
    form: undefined,
    cardInnerScreen: new TextField<CardInnerScreenType>(null),
    onBackCard: () => {},
    onSaveCard: () => {},
    isSending: false,
    markCardAsRemoved: () => {},
  };
};
