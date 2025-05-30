import { translator } from "../../translations/t";

export const translateAddCards = (count: number) => {
  const language = translator.getLang();

  if (language === "ru") {
    const rules = new Intl.PluralRules("ru-RU");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `Добавить ${count} карточку`;
      case "few":
      case "two":
        return `Добавить ${count} карточки`;
      default:
        return `Добавить ${count} карточек`;
    }
  }

  if (language === "es") {
    const rules = new Intl.PluralRules("es-ES");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `Agregar ${count} tarjeta`;
      default:
        return `Agregar ${count} tarjetas`;
    }
  }

  if (language === "pt-br") {
    const rules = new Intl.PluralRules("pt-br");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `Adicionar ${count} cartão`;
      default:
        return `Adicionar ${count} cartões`;
    }
  }

  if (count === 1) {
    return `Add ${count} card`;
  }
  return `Add ${count} cards`;
};
