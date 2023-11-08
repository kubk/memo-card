import { DateTime, Settings } from "luxon";

Settings.throwOnInvalid = true;

export type Result = {
  nextReviewDate: DateTime;
  interval: number;
};

export type ReviewOutcome = "correct" | "wrong";

const easeFactor = 2.5;
const startInterval = 0.4;

export const reviewCard = (
  now: DateTime,
  interval: number | undefined,
  reviewOutcome: ReviewOutcome,
): Result => {
  let calculatedInterval = interval === undefined ? startInterval : interval;

  if (reviewOutcome === "correct") {
    if (calculatedInterval === 0) {
      calculatedInterval = startInterval;
    } else {
      calculatedInterval *= easeFactor;
    }
  } else if (reviewOutcome === "wrong") {
    calculatedInterval = 0;
  }

  const nextReviewDate = now.plus({ day: calculatedInterval });

  return {
    nextReviewDate,
    interval: parseFloat(calculatedInterval.toFixed(2)),
  };
};
