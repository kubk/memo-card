import { DateTime, Settings } from "luxon";

Settings.throwOnInvalid = true;

export type Result = {
  nextReviewDate: DateTime;
  interval: number;
};

export type ReviewOutcome = "correct" | "wrong";

export const reviewCard = (
  now: DateTime,
  interval: number,
  reviewOutcome: ReviewOutcome,
): Result => {
  const easeFactor = 2.5;

  if (reviewOutcome === "correct") {
    interval *= easeFactor;
  } else if (reviewOutcome === "wrong") {
    interval = 0.4;
  }

  const nextReviewDate = now.plus({ day: interval });

  return {
    nextReviewDate,
    interval: parseFloat(interval.toFixed(2)),
  };
};
