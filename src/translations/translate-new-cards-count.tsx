import { translator } from "./t.ts";

export const translateNewCardsCount = (count: number) => {
  const language = translator.getLang();

  if (language === "ru") {
    const rules = new Intl.PluralRules("ru-RU");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return "новая карточка";
      case "few":
        return "новые карточки";
      case "many":
        return "новых карточек";
      case "two":
        return "новые карточки";
    }
  }

  if (language === "es") {
    const rules = new Intl.PluralRules("es-ES");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return "nueva tarjeta";
      case "other":
        return "nuevas tarjetas";
    }
  }

  if (count === 1) {
    return `new card`;
  }
  return `new cards`;
};
