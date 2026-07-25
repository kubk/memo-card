import { selectPluralForm } from "api";
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
    case "ru":
      return selectPluralForm("ru", count, {
        one: `Повторить ${count} карточку`,
        few: `Повторить ${count} карточки`,
        other: `Повторить ${count} карточек`,
      });
    case "uk":
      return selectPluralForm("uk", count, {
        one: `Повторити ${count} картку`,
        few: `Повторити ${count} картки`,
        other: `Повторити ${count} карток`,
      });
    case "pt-br":
      return selectPluralForm("pt-br", count, {
        one: `Revisar ${count} carta`,
        other: `Revisar ${count} cartas`,
      });
    case "es":
      return selectPluralForm("es", count, {
        one: `Revisar ${count} tarjeta`,
        other: `Revisar ${count} tarjetas`,
      });
    case "ar":
      return selectPluralForm("ar", count, {
        one: `مراجعة ${count} بطاقة`,
        two: `مراجعة ${count} بطاقتين`,
        few: `مراجعة ${count} بطاقات`,
        other: `مراجعة ${count} بطاقة`,
      });
    case "fa": {
      return `مرور ${count} کارت`;
    }
    default: {
      return language satisfies never;
    }
  }
};
