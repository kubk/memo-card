import { describe, it, expect } from "vitest";
import { getTimeEstimate } from "./get-time-estimate.ts";
import { CardUnderReviewStore } from "./store/card-under-review-store.ts";
import { createInitialFsrsReviewState } from "api";

const language = "en" as const;
const dayMs = 24 * 60 * 60 * 1000;

function createNewCard(id: number): CardUnderReviewStore {
  return {
    id,
    cardReviewType: "new",
    ...createInitialFsrsReviewState(new Date()),
  } as CardUnderReviewStore;
}

function createRepeatCard(id: number, scheduledDays = 2.5) {
  const now = new Date();
  return {
    id,
    cardReviewType: "repeat" as const,
    due: now.toISOString(),
    stability: Math.max(scheduledDays, 0.1),
    difficulty: 2.1,
    elapsedDays: 0,
    scheduledDays: Math.round(scheduledDays),
    learningSteps: 0,
    reps: 1,
    lapses: 0,
    fsrsState: 2,
    lastReviewDate: new Date(
      now.getTime() - scheduledDays * dayMs,
    ).toISOString(),
  } as CardUnderReviewStore;
}

describe("time estimation for review buttons", () => {
  it("shows product-tuned estimates for new cards", () => {
    const newCard = createNewCard(1);
    const estimates = {
      again: getTimeEstimate("again", newCard, language),
      hard: getTimeEstimate("hard", newCard, language),
      good: getTimeEstimate("good", newCard, language),
      easy: getTimeEstimate("easy", newCard, language),
    };

    expect(estimates).toEqual({
      again: "<10 m",
      hard: "12 h",
      good: "1 d",
      easy: "3 d",
    });
  });

  it("uses FSRS state for repeat-card estimates", () => {
    const repeatCard = createRepeatCard(2);
    const estimates = {
      again: getTimeEstimate("again", repeatCard, language),
      hard: getTimeEstimate("hard", repeatCard, language),
      good: getTimeEstimate("good", repeatCard, language),
      easy: getTimeEstimate("easy", repeatCard, language),
    };

    expect(estimates).toEqual({
      again: "<10 m",
      hard: "4 d",
      good: "6 d",
      easy: "1.4 w",
    });
  });

  it("good and easy show different values", () => {
    const repeatCard = createRepeatCard(1);
    const goodEstimate = getTimeEstimate("good", repeatCard, language);
    const easyEstimate = getTimeEstimate("easy", repeatCard, language);

    expect(goodEstimate).toBe("6 d");
    expect(easyEstimate).toBe("1.4 w");
    expect(goodEstimate).not.toBe(easyEstimate);
  });

  it("keeps high-interval estimates bounded by FSRS retention settings", () => {
    const cardWith365Days = createRepeatCard(1, 365);
    const estimates = {
      hard: getTimeEstimate("hard", cardWith365Days, language),
      good: getTimeEstimate("good", cardWith365Days, language),
      easy: getTimeEstimate("easy", cardWith365Days, language),
    };

    expect(estimates).toEqual({
      hard: "10.9 mo",
      good: "1.1 y",
      easy: "1.8 y",
    });
  });
});
