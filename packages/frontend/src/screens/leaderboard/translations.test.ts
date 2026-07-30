import { describe, expect, test, vi } from "vitest";
import {
  translateLeaderboardReviewLabel,
  translateLeaderboardReviewsToPass,
} from "./translations.ts";

const lang = vi.hoisted(() => vi.fn());
vi.mock("../../translations/t.ts", () => {
  return {
    translator: {
      getLang: lang,
    },
  };
});

describe("leaderboard review translations", () => {
  test.each([
    [1, "повторение"],
    [2, "повторения"],
    [5, "повторений"],
    [20, "повторений"],
    [21, "повторение"],
    [22, "повторения"],
    [25, "повторений"],
    [30, "повторений"],
    [81, "повторение"],
  ])("selects the Russian form for %i", (count, expected) => {
    lang.mockReturnValue("ru");

    expect(translateLeaderboardReviewLabel(count)).toBe(expected);
  });

  test.each([
    ["en", 1, "review"],
    ["en", 2, "reviews"],
    ["uk", 1, "повторення"],
    ["uk", 2, "повторення"],
    ["uk", 5, "повторень"],
    ["uk", 21, "повторення"],
    ["es", 1, "repaso"],
    ["es", 2, "repasos"],
    ["pt-br", 1, "revisão"],
    ["pt-br", 2, "revisões"],
    ["fa", 1, "مرور"],
    ["fa", 2, "مرور"],
  ] as const)("selects the %s form for %i", (language, count, expected) => {
    lang.mockReturnValue(language);

    expect(translateLeaderboardReviewLabel(count)).toBe(expected);
  });

  test.each([
    [0, "مراجعة"],
    [1, "مراجعة"],
    [2, "مراجعتان"],
    [3, "مراجعات"],
    [11, "مراجعة"],
    [100, "مراجعة"],
  ])("selects the Arabic form for %i", (count, expected) => {
    lang.mockReturnValue("ar");

    expect(translateLeaderboardReviewLabel(count)).toBe(expected);
  });

  test("includes the selected plural form in the next-rank message", () => {
    lang.mockReturnValue("ru");

    expect(translateLeaderboardReviewsToPass(81)).toBe(
      "повторение, чтобы обойти",
    );
    expect(translateLeaderboardReviewsToPass(82)).toBe(
      "повторения, чтобы обойти",
    );
    expect(translateLeaderboardReviewsToPass(85)).toBe(
      "повторений, чтобы обойти",
    );
  });
});
