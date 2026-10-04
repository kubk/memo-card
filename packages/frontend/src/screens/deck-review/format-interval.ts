import type { LanguageShared } from "api";
import { translationResourceStore } from "../../translations/t.ts";

export type ReviewIntervalUnit =
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

export function formatInterval(
  intervalDays: number,
  language: LanguageShared,
): string {
  const minutes = intervalDays * 24 * 60;
  const hours = intervalDays * 24;
  const weeks = intervalDays / 7;
  const months = intervalDays / 28;
  const years = intervalDays / 365;

  let value: number;
  let unit: ReviewIntervalUnit;

  if (hours < 1) {
    value = Math.round(minutes);
    unit = "minute";
  } else if (hours < 24) {
    value = Math.round(hours);
    unit = "hour";
  } else if (intervalDays < 7) {
    value = Math.round(intervalDays);
    unit = "day";
  } else if (intervalDays < 28) {
    const roundedWeeks = Math.round(weeks * 10) / 10;
    value = roundedWeeks % 1 === 0 ? Math.round(roundedWeeks) : roundedWeeks;
    unit = "week";
  } else if (intervalDays < 365) {
    const roundedMonths = Math.round(months * 10) / 10;
    value = roundedMonths % 1 === 0 ? Math.round(roundedMonths) : roundedMonths;
    unit = "month";
  } else {
    const roundedYears = Math.round(years * 10) / 10;
    value = roundedYears % 1 === 0 ? Math.round(roundedYears) : roundedYears;
    unit = "year";
  }

  return translationResourceStore.translate(language, "review_interval", {
    value,
    unit,
  });
}
