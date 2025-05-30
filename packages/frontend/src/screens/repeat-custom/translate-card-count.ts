import { translator } from "../../translations/t.ts";

export const translateCardCount = (count: number) => {
  const language = translator.getLang();
  switch (language) {
    case "en": {
      switch (count) {
        case 1:
          return `1 card`;
        default:
          return `${count} cards`;
      }
    }
    case "ru": {
      const result = new Intl.PluralRules("ru-RU").select(count);
      switch (result) {
        case "one":
          return `${count} карточка`;
        case "few":
        case "two":
          return `${count} карточки`;
        default:
          return `${count} карточек`;
      }
    }
    case "uk": {
      const result = new Intl.PluralRules("uk").select(count);
      switch (result) {
        case "one":
          return `${count} картка`;
        case "few":
        case "two":
          return `${count} картки`;
        default:
          return `${count} карток`;
      }
    }
    case "fa": {
      return `${count} کارت`;
    }
    case "ar": {
      const rules = new Intl.PluralRules("ar");
      const result = rules.select(count);

      switch (result) {
        case "one":
          return `${count} بطاقة`;
        case "two":
          return `${count} بطاقتين`;
        case "few":
          return `${count} بطاقات`;
        default:
          return `${count} بطاقة`;
      }
    }
    case "es": {
      const rules = new Intl.PluralRules("es-ES");
      const result = rules.select(count);

      switch (result) {
        case "one":
          return `${count} tarjeta`;
        default:
          return `${count} tarjetas`;
      }
    }
    case "pt-br": {
      const rules = new Intl.PluralRules("pt-br");
      const result = rules.select(count);

      switch (result) {
        case "one":
          return `${count} carta`;
        default:
          return `${count} cartas`;
      }
    }
    default: {
      return language satisfies never;
    }
  }
};
