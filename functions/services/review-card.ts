import { DateTime, Settings } from "luxon";

Settings.throwOnInvalid = true;

export type Result = {
  nextReviewDate: DateTime;
  interval: number;
  easeFactor: number;
};

export type ReviewOutcome = "correct" | "wrong";

const startEaseFactor = 2.5; // is the initial easiness factor. Tells how easy the card is to remember
const startInterval = 0.4; // is the initial interval for the first review in days
const easeFactorDecrement = 0.15; // The amount to decrease easeFactor when the answer is wrong
const minimumEaseFactor = 1.3; // Set a minimum easeFactor to avoid it becoming too small
const easeFactorIncrement = 0.1; // The amount to increase easeFactor if the answer is correct

export const reviewCard = (
  now: DateTime,
  interval: number | undefined = startInterval,
  reviewOutcome: ReviewOutcome,
  easeFactor: number | undefined = startEaseFactor,
  isInterrupted = false,
): Result => {
  if (reviewOutcome === "correct") {
    interval = interval === 0 ? startInterval : interval * easeFactor;
    easeFactor = Math.min(easeFactor + easeFactorIncrement, startEaseFactor);
  } else if (reviewOutcome === "wrong") {
    easeFactor = Math.max(easeFactor - easeFactorDecrement, minimumEaseFactor);
    interval = isInterrupted ? 0 : startInterval;
  }

  return {
    nextReviewDate: now.plus({ day: interval }),
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    interval: parseFloat(interval.toFixed(2)),
  };
};
