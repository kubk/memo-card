import { expect, test } from "vitest";
import { reviewCard, ReviewOutcome } from "./review-card.ts";
import { DateTime } from "luxon";

// For comparison: https://github.com/open-spaced-repetition/fsrs4anki/wiki/Compare-Anki's-built-in-scheduler-and-FSRS

const testReviewWithAnswers = (answers: ReviewOutcome[]) => {
  let date = DateTime.fromSQL("2021-05-20 10:00:00");
  let interval = undefined;
  let easeFactor = undefined;

  const intervals: number[] = [];
  const easeFactors: number[] = [];
  const dateIntervals = [];

  for (const answer of answers) {
    const {
      nextReviewDate,
      interval: newInterval,
      easeFactor: newEaseFactor,
    } = reviewCard(date, interval, answer, easeFactor);
    intervals.push(newInterval);
    easeFactors.push(newEaseFactor);
    dateIntervals.push(nextReviewDate.diff(date));

    interval = newInterval;
    date = nextReviewDate;
    easeFactor = newEaseFactor;
  }

  return { intervals, easeFactors, dateIntervals };
};

test("hit yes all the time", () => {
  const { intervals, dateIntervals, easeFactors } = testReviewWithAnswers([
    "correct",
    "correct",
    "correct",
    "correct",
  ]);

  expect(intervals).toEqual([1, 2.5, 6.25, 15.63]);
  expect(
    dateIntervals.map((dateInterval) => dateInterval.milliseconds),
  ).toEqual([
    // 1 day
    3600 * 24 * 1000,
    // 2.5 days
    3600 * 24 * 1000 * 2.5,
    // 6.25 days
    3600 * 24 * 1000 * 6.25,
    // 15.625 days
    3600 * 24 * 1000 * 15.625,
  ]);
  expect(easeFactors).toEqual([2.5, 2.5, 2.5, 2.5]);
});

test("hit wrong, then hit yes all the time", () => {
  const { intervals, easeFactors } = testReviewWithAnswers([
    "wrong",
    "correct",
    "correct",
    "correct",
    "correct",
  ]);

  expect(intervals).toEqual([0.4, 0.94, 2.3, 5.75, 14.38]);
  expect(easeFactors).toEqual([2.35, 2.45, 2.5, 2.5, 2.5]);
});

test("difficult to remember card", () => {
  const { intervals } = testReviewWithAnswers([
    "wrong",
    "correct",
    "wrong",
    "correct",
    "correct",
    "correct",
  ]);

  expect(intervals).toEqual([0.4, 0.94, 0.4, 0.92, 2.21, 5.53]);
});

test("forgetting resets interval - non interrupted", () => {
  const date = DateTime.fromSQL("2021-05-20 10:00:00");

  const { interval: newInterval1, easeFactor: newEaseFactor1 } = reviewCard(
    date,
    undefined,
    "correct",
    undefined,
  );
  expect(newInterval1).toBe(1);
  expect(newEaseFactor1).toBe(2.5);

  const { interval: newInterval2, easeFactor: newEaseFactor2 } = reviewCard(
    date,
    1,
    "wrong",
    newEaseFactor1,
  );
  expect(newInterval2).toBe(0.4);
  expect(newEaseFactor2).toBe(2.35);

  const { interval: newInterval3, easeFactor: newEaseFactor3 } = reviewCard(
    date,
    0,
    "wrong",
    newEaseFactor2,
  );
  expect(newInterval3).toBe(0.4);
  expect(newEaseFactor3).toBe(2.2);

  const { interval: newInterval4, easeFactor: newEasyFactor4 } = reviewCard(
    date,
    0,
    "correct",
    newEaseFactor3,
  );
  expect(newInterval4).toBe(0.4);
  expect(newEasyFactor4).toBe(2.3);

  const { interval: newInterval5, easeFactor: newEasyFactor5 } = reviewCard(
    date,
    0.4,
    "correct",
    newEasyFactor4,
  );
  expect(newInterval5).toBe(0.92);
  expect(newEasyFactor5).toBe(2.4);
});

test("forgetting resets interval - interrupted", () => {
  const date = DateTime.fromSQL("2021-05-20 10:00:00");

  const { interval: newInterval1, easeFactor: newEaseFactor1 } = reviewCard(
    date,
    undefined,
    "correct",
  );
  expect(newInterval1).toBe(1);
  expect(newEaseFactor1).toBe(2.5);

  const { interval: newInterval2, easeFactor: newEaseFactor2 } = reviewCard(
    date,
    1,
    "wrong",
    newEaseFactor1,
    true,
  );
  expect(newInterval2).toBe(0);
  expect(newEaseFactor2).toBe(2.35);

  const { interval: newInterval3, easeFactor: newEaseFactor3 } = reviewCard(
    date,
    0,
    "wrong",
    newEaseFactor2,
    true,
  );
  expect(newInterval3).toBe(0);
  expect(newEaseFactor3).toBe(2.2);

  const { interval: newInterval4, easeFactor: newEaseFactor4 } = reviewCard(
    date,
    0,
    "correct",
    newEaseFactor3,
  );
  expect(newInterval4).toBe(0.4);
  expect(newEaseFactor4).toBe(2.3);

  const { interval: newInterval5, easeFactor: newEaseFactor5 } = reviewCard(
    date,
    0.4,
    "correct",
    newEaseFactor4,
  );
  expect(newInterval5).toBe(0.92);
  expect(newEaseFactor5).toBe(2.4);
});
