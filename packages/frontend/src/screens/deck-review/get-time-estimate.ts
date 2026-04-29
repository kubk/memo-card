import {
  getDaysUntilDue,
  LanguageShared,
  previewReviewCard,
  ReviewOutcome,
} from "api";
import { LimitedCardUnderReviewStore } from "../shared/card/card.tsx";
import { formatInterval } from "./format-interval.ts";

function languageToAgainMessage(language: LanguageShared): string {
  switch (language) {
    case "en":
      return "<10 m";
    case "ru":
      return "<10 мин";
    case "uk":
      return "<10 хв";
    case "es":
      return "<10 min";
    case "pt-br":
      return "<10 min";
    case "fa":
      return "10 دق";
    case "ar":
      return "10 دق";
    default:
      return language satisfies never;
  }
}

export function getTimeEstimate(
  outcome: Exclude<ReviewOutcome, "never">,
  card: LimitedCardUnderReviewStore,
  language: LanguageShared,
): string {
  const now = new Date();

  // "Again" shows the card again in the same session (not the backend calculation)
  if (outcome === "again") {
    return languageToAgainMessage(language);
  }

  const result = previewReviewCard(now, card, outcome);
  return formatInterval(getDaysUntilDue(now, result.due), language);
}
