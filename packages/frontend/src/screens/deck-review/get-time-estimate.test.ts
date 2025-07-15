import { describe, it, expect } from "vitest";
import { getTimeEstimate } from "./get-time-estimate.ts";
import { CardUnderReviewStore } from "./store/card-under-review-store.ts";
import { formatInterval } from "./format-interval.ts";

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

  describe("reproducing the reported bug", () => {
    it("BUG: interval 0 shows the same 10h for hard, good, and easy", () => {
      const cardWithZeroInterval = {
        id: 1,
        // both 'new' and 'repeat' show the same result
        cardReviewType: "repeat" as const,
        interval: 0,
        // doesn't matter
        easeFactor: 2.8,
      } as CardUnderReviewStore;

      const estimates = {
        again: getTimeEstimate("again", cardWithZeroInterval, language),
        hard: getTimeEstimate("hard", cardWithZeroInterval, language),
        good: getTimeEstimate("good", cardWithZeroInterval, language),
        easy: getTimeEstimate("easy", cardWithZeroInterval, language),
      };

      // BUG: These should all be different
      expect(estimates.again).toBe("<10m");
      expect(estimates.hard).toBe("12h");
      expect(estimates.good).toBe("1d");
      expect(estimates.easy).toBe("2d");
    });
  });

  describe("exponential growth creates huge jumps at high intervals", () => {
    it("demonstrates the large interval jump problem", () => {
      // Card that's been reviewed many times (high interval)
      const cardWith365Days = {
        id: 1,
        cardReviewType: "repeat" as const,
        interval: 365, // 1 year
        easeFactor: 2.5,
      } as CardUnderReviewStore;

      const estimates = {
        hard: getTimeEstimate("hard", cardWith365Days, language),
        good: getTimeEstimate("good", cardWith365Days, language),
        easy: getTimeEstimate("easy", cardWith365Days, language),
      };

      console.log("Large interval exponential growth:");
      console.log("Starting interval: 365 days (1 year)");
      console.log("Hard:", estimates.hard); // 365 * 1.2 = 438 days ≈ 1.2y
      console.log("Good:", estimates.good); // With dampening: much more reasonable
      console.log("Easy:", estimates.easy); // With dampening: much more reasonable

      // FIXED! The jump is now much more reasonable with dampening
      expect(estimates.hard).toBe("1.2y"); // 438 / 365 ≈ 1.2y (unchanged, hard uses hardIntervalMultiplier)
      expect(estimates.good).toBe("1.8y"); // With dampening: reduced from 3y to 1.8y!
      expect(estimates.easy).toBe("3.6y"); // With dampening: reduced from 5y to 3.6y!
    });
  });

  describe("decimal year formatting", () => {
    it.each([
      { days: 456.25, expected: "1.5y" },
      { days: 547.5, expected: "1.8y" },
      { days: 638.54, expected: "2.1y" },
      { days: 839.5, expected: "2.8y" },
      { days: 912.5, expected: "3y" },
      { days: 1003.47, expected: "3.3y" },
      { days: 1277.08, expected: "4.2y" },
    ])("formats $days days as $expected", ({ days, expected }) => {
      const card = {
        id: 1,
        cardReviewType: "repeat" as const,
        interval: days,
        easeFactor: 2.5,
      } as CardUnderReviewStore;

      const estimate = getTimeEstimate("hard", card, "en");
      expect(estimate).toBe(expected);
    });

    it.each([
      { lang: "en" as const, days: 547.5, expected: "1.8y" },
      { lang: "ru" as const, days: 547.5, expected: "1.8г" },
      { lang: "uk" as const, days: 547.5, expected: "1.8р" },
      { lang: "es" as const, days: 547.5, expected: "1.8a" },
      { lang: "pt-br" as const, days: 547.5, expected: "1.8a" },
      { lang: "fa" as const, days: 547.5, expected: "1.8سال" },
      { lang: "ar" as const, days: 547.5, expected: "1.8سنتين" },
      { lang: "en" as const, days: 456.25, expected: "1.5y" },
      { lang: "ru" as const, days: 456.25, expected: "1.5г" },
      { lang: "uk" as const, days: 456.25, expected: "1.5р" },
      { lang: "es" as const, days: 456.25, expected: "1.5a" },
      { lang: "pt-br" as const, days: 456.25, expected: "1.5a" },
      { lang: "fa" as const, days: 456.25, expected: "1.5سال" },
      { lang: "ar" as const, days: 456.25, expected: "1.5سنتين" },
      { lang: "en" as const, days: 912.5, expected: "3y" },
      { lang: "ru" as const, days: 912.5, expected: "3 г" },
      { lang: "uk" as const, days: 912.5, expected: "3 р" },
      { lang: "es" as const, days: 912.5, expected: "3 a" },
      { lang: "pt-br" as const, days: 912.5, expected: "3 a" },
      { lang: "fa" as const, days: 912.5, expected: "۳ سال" },
      { lang: "ar" as const, days: 912.5, expected: "3 سنوات" },
    ])(
      "formats $days days as $expected in $lang",
      ({ lang, days, expected }) => {
        const card = {
          id: 1,
          cardReviewType: "repeat" as const,
          interval: days,
          easeFactor: 2.5,
        } as CardUnderReviewStore;

        const estimate = getTimeEstimate("hard", card, lang);
        expect(estimate).toBe(expected);
      },
    );
  });
});
