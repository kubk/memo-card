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
  }
};
