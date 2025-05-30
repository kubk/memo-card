import { translator } from "../../translations/t.ts";

export const formatFrozenCards = (cards: number) => {
  const language = translator.getLang();
  switch (language) {
    case "en": {
      return cards === 1
        ? `1 card has been frozen`
        : `${cards} cards have been frozen`;
    }
    case "ru": {
      const rules = new Intl.PluralRules("ru-RU");
      const result = rules.select(cards);
      switch (result) {
        case "one":
          return `${cards} карточка заморожена`;
        case "few":
          return `${cards} карточки заморожены`;
        case "many":
          return `${cards} карточек заморожено`;
        case "two":
        default:
          return `${cards} карточки заморожены`;
      }
    }
    case "uk": {
      const rulesUk = new Intl.PluralRules("uk");
      const resultUk = rulesUk.select(cards);
      switch (resultUk) {
        case "one":
          return `${cards} картка заморожена`;
        case "few":
          return `${cards} картки заморожені`;
        case "many":
          return `${cards} карток заморожено`;
        case "two":
        default:
          return `${cards} картки заморожені`;
      }
    }
    case "es": {
      const rulesEs = new Intl.PluralRules("es-ES");
      const resultEs = rulesEs.select(cards);
      switch (resultEs) {
        case "one":
          return `${cards} tarjeta ha sido congelada`;
        case "other":
        default:
          return `${cards} han sido congeladas`;
      }
    }
    case "pt-br": {
      const rulesPt = new Intl.PluralRules("pt-br");
      const resultPt = rulesPt.select(cards);
      switch (resultPt) {
        case "one":
          return `${cards} cartão foi congelado`;
        case "other":
        default:
          return `${cards} foram congelados`;
      }
    }
    case "ar": {
      const rulesAr = new Intl.PluralRules("ar");
      const resultAr = rulesAr.select(cards);
      switch (resultAr) {
        case "one":
          return `تم تجميد بطاقة واحدة`;
        case "few":
          return `تم تجميد ${cards} بطاقات`;
        case "many":
          return `تم تجميد ${cards} بطاقة`;
        case "two":
        default:
          return `تم تجميد ${cards} بطاقة`;
      }
    }
    case "fa": {
      const rulesFa = new Intl.PluralRules("fa");
      const resultFa = rulesFa.select(cards);
      switch (resultFa) {
        case "one":
          return `${cards} کارت یخ زده شده است`;
        case "other":
        default:
          return `${cards} کارت یخ زده شده اند`;
      }
    }
    default:
      return language satisfies never;
  }
};

export const formatDays = (days: number) => {
  const language = translator.getLang();

  switch (language) {
    case "en":
      return `${days === 1 ? "1 day" : `${days} days`}`;
    case "ru": {
      const rules = new Intl.PluralRules("ru-RU");
      const result = rules.select(days);
      switch (result) {
        case "one":
          return `${days} день`;
        case "few":
          return `${days} дня`;
        case "many":
          return `${days} дней`;
        case "two":
        default:
          return `${days} дня`;
      }
    }
    case "pt-br": {
      const rulesPt = new Intl.PluralRules("pt-br");
      const resultPt = rulesPt.select(days);
      switch (resultPt) {
        case "one":
          return `${days} dia`;
        case "other":
        default:
          return `${days} dias`;
      }
    }
    case "es": {
      const rulesEs = new Intl.PluralRules("es-ES");
      const resultEs = rulesEs.select(days);
      switch (resultEs) {
        case "one":
          return `${days} día`;
        case "other":
        default:
          return `${days} días`;
      }
    }
    case "ar": {
      const rulesAr = new Intl.PluralRules("ar");
      const resultAr = rulesAr.select(days);
      switch (resultAr) {
        case "one":
          return `${days} يوم`;
        case "few":
          return `${days} أيام`;
        case "many":
          return `${days} يومًا`;
        case "two":
        default:
          return `${days} يومًا`;
      }
    }
    case "fa": {
      const rulesFa = new Intl.PluralRules("fa");
      const resultFa = rulesFa.select(days);
      switch (resultFa) {
        case "one":
          return `${days} روز`;
        case "other":
        default:
          return `${days} روز`;
      }
    }
    case "uk": {
      const rulesUk = new Intl.PluralRules("uk");
      const resultUk = rulesUk.select(days);
      switch (resultUk) {
        case "one":
          return `${days} день`;
        case "few":
          return `${days} дні`;
        case "many":
          return `${days} днів`;
        case "two":
        default:
          return `${days} дні`;
      }
    }
    default:
      return language satisfies never;
  }
};
