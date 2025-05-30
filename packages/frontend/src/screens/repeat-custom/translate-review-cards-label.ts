import { translator } from "../../translations/t.ts";

export const translateReviewCardsLabel = (count: number) => {
  const language = translator.getLang();

  switch (language) {
    case "en": {
      switch (count) {
        case 1:
          return `Review ${count} card`;
        default:
          return `Review ${count} cards`;
      }
    }
    case "ru": {
      const result = new Intl.PluralRules("ru-RU").select(count);
      switch (result) {
        case "one":
          return `Повторить ${count} карточку`;
        case "few":
        case "two":
          return `Повторить ${count} карточки`;
        default:
          return `Повторить ${count} карточек`;
      }
    }
    case "uk": {
      const result = new Intl.PluralRules("uk").select(count);
      switch (result) {
        case "one":
          return `Повторити ${count} картку`;
        case "few":
        case "two":
          return `Повторити ${count} картки`;
        default:
          return `Повторити ${count} карток`;
      }
    }
    case "pt-br": {
      const result = new Intl.PluralRules("pt-br").select(count);
      switch (result) {
        case "one":
          return `Revisar ${count} carta`;
        default:
          return `Revisar ${count} cartas`;
      }
    }
    case "es": {
      const rules = new Intl.PluralRules("es-ES");
      const result = rules.select(count);

      switch (result) {
        case "one":
          return `Revisar ${count} tarjeta`;
        default:
          return `Revisar ${count} tarjetas`;
      }
    }
    case "ar": {
      const rules = new Intl.PluralRules("ar");
      const result = rules.select(count);

      switch (result) {
        case "one":
          return `مراجعة ${count} بطاقة`;
        case "two":
          return `مراجعة ${count} بطاقتين`;
        case "few":
          return `مراجعة ${count} بطاقات`;
        default:
          return `مراجعة ${count} بطاقة`;
      }
    }
    case "fa": {
      return `مرور ${count} کارت`;
    }
    default: {
      return language satisfies never;
    }
  }
};
