import { selectPluralForm } from "api";
import { translator } from "./t.ts";

export const translateNewCardsCount = (count: number) => {
  const language = translator.getLang();

  if (language === "ru") {
    return selectPluralForm("ru", count, {
      one: `${count} новая карточка`,
      few: `${count} новые карточки`,
      many: `${count} новых карточек`,
      other: `${count} новые карточки`,
    });
  }

  if (language === "es") {
    return selectPluralForm("es", count, {
      one: `${count} nueva tarjeta`,
      other: `${count} nuevas tarjetas`,
    });
  }

  if (language === "pt-br") {
    return selectPluralForm("pt-br", count, {
      one: `${count} novo cartão`,
      other: `${count} novos cartões`,
    });
  }

  if (count === 1) {
    return `${count} new card`;
  }
  return `${count} new cards`;
};
