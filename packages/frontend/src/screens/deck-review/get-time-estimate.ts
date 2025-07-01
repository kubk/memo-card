import { LanguageShared, reviewCard, ReviewOutcome } from "api";
import { DateTime } from "luxon";
import { LimitedCardUnderReviewStore } from "../shared/card/card.tsx";
import { formatInterval } from "./format-interval.ts";

function languageToAgainMessage(language: LanguageShared): string {
  switch (language) {
    case "en":
      return "<10m";
    case "ru":
      return "<10 мин";
    case "uk":
      return "<10 хв";
    case "es":
      return "<10 min";
    case "pt-br":
      return "<10 min";
    case "fa":
      return "۱۰ د";
    case "ar":
      return "١٠ د";
    default:
      return language satisfies never;
  }
}

export function getTimeEstimate(
  outcome: ReviewOutcome,
  card: LimitedCardUnderReviewStore,
  language: LanguageShared,
): string {
  const now = DateTime.now();

  // "Again" shows the card again in the same session (not the backend calculation)
  if (outcome === "again") {
    return languageToAgainMessage(language);
  }

  const result = reviewCard(now, card.interval, outcome, card.easeFactor);
  return formatInterval(result.interval, language);
}
