import { expect, test } from "vitest";
import { reviewCard } from "./review-card.ts";
import { DateTime } from "luxon";

// For comparison: https://github.com/open-spaced-repetition/fsrs4anki/wiki/Compare-Anki's-built-in-scheduler-and-FSRS
test("hit yes all the time", () => {
  let date = DateTime.fromSQL("2021-05-20 10:00:00");
  let interval = 0.4;

  const intervals = [interval];
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

  expect(intervals).toEqual([0.4, 1, 2.5, 6.25, 15.63]);
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
