import { MemoCardTranslator } from "../translations/create-translator.ts";
import { renderFieldValue } from "./render-field-value.ts";

export const renderManyCardsToCreate = (
  cards: Array<{
    cardFront: string;
    cardBack: string;
    cardExample: string | null;
  }>,
  translator: MemoCardTranslator,
) => {
  let message = translator.translate("confirm_many_cards_creation");
  for (let i = 0; i < cards.length; i++) {
    message += `\n\n*${i + 1}*${renderFieldValue(".")} *${translator.translate(
      "confirm_many_cards_front",
    )}* ${renderFieldValue(cards[i].cardFront)}`;
    message += `\n*${translator.translate(
      "confirm_many_cards_back",
    )}* ${renderFieldValue(cards[i].cardBack)}`;
    message += `\n*${translator.translate(
      "confirm_many_cards_example",
    )}* ${renderFieldValue(cards[i].cardExample)}`;
  }
  return message;
};
