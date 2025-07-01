import { describe, it, expect } from "vitest";
import { getTimeEstimate } from "./get-time-estimate.ts";
import { CardUnderReviewStore } from "./store/card-under-review-store.ts";

import {
  DEFAULT_EASE_FACTOR,
  DEFAULT_START_INTERVAL,
  DEFAULT_REPEAT_INTERVAL,
} from "api";

function createMockCard(
  id: number,
  cardReviewType: "new" | "repeat",
): CardUnderReviewStore {
  return {
    id,
    cardReviewType,
    interval:
      cardReviewType === "new"
        ? DEFAULT_START_INTERVAL
        : DEFAULT_REPEAT_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
  } as CardUnderReviewStore;
}

const language = "en" as const;

describe("time estimation for review buttons", () => {
  describe("new cards (interval = 0)", () => {
    it("should show reasonable estimates for all buttons", () => {
      const newCard = createMockCard(1, "new");
      const estimates = {
        again: getTimeEstimate("again", newCard, language),
        hard: getTimeEstimate("hard", newCard, language),
        good: getTimeEstimate("good", newCard, language),
        easy: getTimeEstimate("easy", newCard, language),
      };

      // Again shows card in same session (frontend behavior)
      expect(estimates.again).toBe("<10m");

      // Hard: 0.4 * 1.2 = 0.48 days ≈ 12h
      expect(estimates.hard).toBe("12h");

      // Good: 0.4 * 2.5 = 1.0 days
      expect(estimates.good).toBe("1d");

      // Easy: 0.4 * 2.5 * 2.0 = 2.0 days
      expect(estimates.easy).toBe("2d");
    });
  });

  describe("repeat cards (interval = 2.5 days)", () => {
    it("should show reasonable estimates for all buttons", () => {
      const repeatCard = createMockCard(2, "repeat");
      const estimates = {
        again: getTimeEstimate("again", repeatCard, language),
        hard: getTimeEstimate("hard", repeatCard, language),
        good: getTimeEstimate("good", repeatCard, language),
        easy: getTimeEstimate("easy", repeatCard, language),
      };

      // Again shows card in same session (frontend behavior)
      expect(estimates.again).toBe("<10m");

      // Repeat card uses DEFAULT_REPEAT_INTERVAL = 2.5
      // Hard: 2.5 * 1.2 = 3 days
      expect(estimates.hard).toBe("3d");

      // Good: 2.5 * 2.5 = 6.25 = 6d
      expect(estimates.good).toBe("6d");

      // Easy: 2.5 * 2.5 * 2.0 = 12.5 = 2w
      expect(estimates.easy).toBe("2w");
    });
  });

  describe("the main issues from screenshot", () => {
    it("again should show 1m for immediate re-appearance", () => {
      const repeatCard = createMockCard(3, "repeat");
      const againEstimate = getTimeEstimate("again", repeatCard, language);
      // Fixed: "again" shows card in same session
      expect(againEstimate).toBe("<10m");
    });

    it("good and easy should show different values", () => {
      const repeatCard = createMockCard(1, "repeat"); // ID 1 -> index 1 -> interval 2.5
      const goodEstimate = getTimeEstimate("good", repeatCard, language);
      const easyEstimate = getTimeEstimate("easy", repeatCard, language);

      // Good: 2.5 * 2.5 = 6.25 = 6d
      // Easy: 2.5 * 2.5 * 2.0 = 12.5 = 2w
      expect(goodEstimate).toBe("6d");
      expect(easyEstimate).toBe("2w");
      expect(goodEstimate).not.toBe(easyEstimate);
    });
  });
});
