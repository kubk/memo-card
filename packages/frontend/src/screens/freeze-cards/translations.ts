import { selectPluralForm } from "api";
import { translator } from "../../translations/t.ts";
export { formatDays } from "../../translations/format-days.ts";

export const formatFrozenCards = (cards: number) => {
  const language = translator.getLang();
  switch (language) {
    case "en": {
      return cards === 1
        ? `1 card has been frozen`
        : `${cards} cards have been frozen`;
    }
    case "ru":
      return selectPluralForm("ru", cards, {
        one: `${cards} карточка заморожена`,
        few: `${cards} карточки заморожены`,
        many: `${cards} карточек заморожено`,
        other: `${cards} карточки заморожены`,
      });
    case "uk":
      return selectPluralForm("uk", cards, {
        one: `${cards} картка заморожена`,
        few: `${cards} картки заморожені`,
        many: `${cards} карток заморожено`,
        other: `${cards} картки заморожені`,
      });
    case "es":
      return selectPluralForm("es", cards, {
        one: `${cards} tarjeta ha sido congelada`,
        other: `${cards} han sido congeladas`,
      });
    case "pt-br":
      return selectPluralForm("pt-br", cards, {
        one: `${cards} cartão foi congelado`,
        other: `${cards} foram congelados`,
      });
    case "ar":
      return selectPluralForm("ar", cards, {
        one: `تم تجميد بطاقة واحدة`,
        few: `تم تجميد ${cards} بطاقات`,
        many: `تم تجميد ${cards} بطاقة`,
        other: `تم تجميد ${cards} بطاقة`,
      });
    case "fa":
      return selectPluralForm("fa", cards, {
        one: `${cards} کارت یخ زده شده است`,
        other: `${cards} کارت یخ زده شده اند`,
      });
    default:
      return language satisfies never;
  }
};
