import { expect, test, describe } from "vitest";
import {
  isWordBoundaryMatch,
  calculateRelevanceScore,
} from "./search-relevance-score.ts";

describe("isWordBoundaryMatch", () => {
  test("returns true for exact word match", () => {
    expect(isWordBoundaryMatch("rice", "rice")).toBe(true);
  });

  test("returns true for word at beginning of text", () => {
    expect(isWordBoundaryMatch("rice is good", "rice")).toBe(true);
  });

  test("returns true for word at end of text", () => {
    expect(isWordBoundaryMatch("i like rice", "rice")).toBe(true);
  });

  test("returns true for word in middle of text", () => {
    expect(isWordBoundaryMatch("the rice is good", "rice")).toBe(true);
  });

  test("returns false for substring inside another word", () => {
    expect(isWordBoundaryMatch("priced", "rice")).toBe(false);
  });

  test("returns true for word after punctuation", () => {
    expect(isWordBoundaryMatch("food: rice", "rice")).toBe(true);
  });

  test("returns true for word before punctuation", () => {
    expect(isWordBoundaryMatch("rice, beans", "rice")).toBe(true);
  });
});

describe("calculateRelevanceScore", () => {
  test("exact match scores highest", () => {
    const exactScore = calculateRelevanceScore(
      [{ field: "front", value: "Rice" } as const],
      "rice",
    );
    const wordBoundaryScore = calculateRelevanceScore(
      [{ field: "front", value: "rice is good" } as const],
      "rice",
    );
    expect(exactScore).toBeGreaterThan(wordBoundaryScore);
  });

  test("word boundary match scores above substring match", () => {
    const wordBoundaryScore = calculateRelevanceScore(
      [{ field: "front", value: "I like Rice" } as const],
      "rice",
    );
    const substringScore = calculateRelevanceScore(
      [{ field: "front", value: "reasonably priced" } as const],
      "rice",
    );
    expect(wordBoundaryScore).toBeGreaterThan(substringScore);
  });

  test("word boundary at start scores above word boundary later in text", () => {
    const startScore = calculateRelevanceScore(
      [{ field: "front", value: "rice is good" } as const],
      "rice",
    );
    const laterScore = calculateRelevanceScore(
      [{ field: "front", value: "I like rice" } as const],
      "rice",
    );
    expect(startScore).toBeGreaterThan(laterScore);
  });

  test("field importance: name > front > back > description > example", () => {
    const nameScore = calculateRelevanceScore(
      [{ field: "name", value: "test" } as const],
      "test",
    );
    const frontScore = calculateRelevanceScore(
      [{ field: "front", value: "test" } as const],
      "test",
    );
    const backScore = calculateRelevanceScore(
      [{ field: "back", value: "test" } as const],
      "test",
    );
    const descScore = calculateRelevanceScore(
      [{ field: "description", value: "test" } as const],
      "test",
    );
    const exampleScore = calculateRelevanceScore(
      [{ field: "example", value: "test" } as const],
      "test",
    );

    expect(nameScore).toBeGreaterThan(frontScore);
    expect(frontScore).toBeGreaterThanOrEqual(backScore);
    expect(backScore).toBeGreaterThan(descScore);
    expect(descScore).toBeGreaterThan(exampleScore);
  });

  test("no match returns 0", () => {
    const score = calculateRelevanceScore(
      [{ field: "front", value: "hello world" } as const],
      "rice",
    );
    expect(score).toBe(0);
  });

  test("Rice card ranks higher than reasonably priced card", () => {
    const riceScore = calculateRelevanceScore(
      [
        { field: "front", value: "Rice" } as const,
        { field: "back", value: "ข้าว" } as const,
      ],
      "rice",
    );

    const pricedScore = calculateRelevanceScore(
      [
        { field: "front", value: "reasonably priced" } as const,
        {
          field: "back",
          value: "адекватная цена; ни дорого, ни дёшево",
        } as const,
        {
          field: "example",
          value:
            "I think their menu is reasonably priced in comparison to other restaurants",
        } as const,
      ],
      "rice",
    );

    expect(riceScore).toBeGreaterThan(pricedScore);
  });
});
