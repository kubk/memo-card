import { translator } from "./t.ts";

export const translateNewCardsCount = (count: number) => {
  const language = translator.getLang();

  if (language === "ru") {
    const rules = new Intl.PluralRules("ru-RU");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `${count} новая карточка`;
      case "few":
        return `${count} новые карточки`;
      case "many":
        return `${count} новых карточек`;
      case "two":
        return `${count} новые карточки`;
    }
  }

  if (language === "es") {
    const rules = new Intl.PluralRules("es-ES");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `${count} nueva tarjeta`;
      case "other":
        return `${count} nuevas tarjetas`;
    }
  }

  if (language === "pt-br") {
    const rules = new Intl.PluralRules("pt-br");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `${count} novo cartão`;
      case "other":
        return `${count} novos cartões`;
    }
  }

  if (count === 1) {
    return `${count} new card`;
  }
  return `${count} new cards`;
};
