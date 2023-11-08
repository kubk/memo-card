import { expect, test } from "vitest";
import { reviewCard } from "./review-card.ts";
import { DateTime } from "luxon";

// For comparison: https://github.com/open-spaced-repetition/fsrs4anki/wiki/Compare-Anki's-built-in-scheduler-and-FSRS
test("hit yes all the time", () => {
  let date = DateTime.fromSQL("2021-05-20 10:00:00");
  let interval = undefined;

  const intervals: number[] = [];
  const dateIntervals = [];

  for (let i = 0; i < 4; i++) {
    const { nextReviewDate, interval: newInterval } = reviewCard(
      date,
      interval,
      "correct",
    );
    intervals.push(newInterval);
    dateIntervals.push(nextReviewDate.diff(date));

    interval = newInterval;
    date = nextReviewDate;
  }

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
});

test("forgetting resets interval", () => {
  const date = DateTime.fromSQL("2021-05-20 10:00:00");

  const { interval: newInterval1 } = reviewCard(date, undefined, "correct");
  expect(newInterval1).toBe(1);

  const { interval: newInterval2 } = reviewCard(date, 1, "wrong");
  expect(newInterval2).toBe(0);

  const { interval: newInterval3 } = reviewCard(date, 0, "wrong");
  expect(newInterval3).toBe(0);

  const { interval: newInterval4 } = reviewCard(date, 0, "correct");
  expect(newInterval4).toBe(0.4);

  const { interval: newInterval5 } = reviewCard(date, 0.4, "correct");
  expect(newInterval5).toBe(1);
});
