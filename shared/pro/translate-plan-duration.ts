import { PlanDuration } from "./calc-plan-price-for-duration.ts";
import { LanguageShared } from "../language/language-shared.ts";

export const translateProDuration = (
  duration: PlanDuration,
  lang: LanguageShared,
) => {
  switch (lang) {
    case "en": {
      const rulesEn = new Intl.PluralRules("en-US");
      const resultEn = rulesEn.select(duration);
      switch (resultEn) {
        case "one":
          return `${duration} month`;
        case "other":
        default:
          return `${duration} months`;
      }
    }
    case "ru": {
      const rulesRu = new Intl.PluralRules("ru-RU");
      const result = rulesRu.select(duration);
      switch (result) {
        case "one":
          return `${duration} месяц`;
        case "few":
          return `${duration} месяца`;
        case "many":
          return `${duration} месяцев`;
        case "two":
        default:
          return `${duration} месяца`;
      }
    }
    case "es": {
      const rulesEs = new Intl.PluralRules("es-ES");
      const resultEs = rulesEs.select(duration);
      switch (resultEs) {
        case "one":
          return `${duration} mes`;
        case "other":
        default:
          return `${duration} meses`;
      }
    }
    case "pt-br": {
      const rulesPt = new Intl.PluralRules("pt-br");
      const resultPt = rulesPt.select(duration);
      switch (resultPt) {
        case "one":
          return `${duration} mês`;
        case "other":
        default:
          return `${duration} meses`;
      }
    }
    default:
      return lang satisfies never;
  }
};
