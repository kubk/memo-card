import { translationResourceStore } from "../../translations/t.ts";
import {
  getDaysUntilDue,
  LanguageShared,
  previewReviewCard,
  ReviewOutcome,
} from "api";
import { LimitedCardUnderReviewStore } from "../shared/card/card.tsx";
import { formatInterval } from "./format-interval.ts";

export function getTimeEstimate(
  outcome: Exclude<ReviewOutcome, "never">,
  card: LimitedCardUnderReviewStore,
  language: LanguageShared,
): string {
  const now = new Date();

  // "Again" shows the card again in the same session (not the backend calculation)
  if (outcome === "again") {
    return translationResourceStore.translate(
      language,
      "review_again_interval",
    );
  }

  const result = previewReviewCard(now, card, outcome);
  return formatInterval(getDaysUntilDue(now, result.due), language);
}
