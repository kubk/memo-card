import { CardAnswerType } from "api";
import { t } from "../../../translations/t.ts";

export const formatCardType = (type: CardAnswerType) => {
  switch (type) {
    case "remember":
      return t("yes_no");
    case "choice_single":
      return t("answer_type_choice");
    default:
      return type satisfies never;
  }
};

export const formatCardTypeDescription = (type: CardAnswerType) => {
  switch (type) {
    case "remember":
      return t("answer_type_explanation_remember");
    case "choice_single":
      return t("answer_type_explanation_choice");
    default:
      return type satisfies never;
  }
};
