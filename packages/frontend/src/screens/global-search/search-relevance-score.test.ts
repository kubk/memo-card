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

  test("returns false for substring in reasonably priced", () => {
    expect(isWordBoundaryMatch("reasonably priced", "rice")).toBe(false);
  });

  test("returns true for word after punctuation", () => {
    expect(isWordBoundaryMatch("food: rice", "rice")).toBe(true);
  });

  test("returns true for word before punctuation", () => {
    expect(isWordBoundaryMatch("rice, beans", "rice")).toBe(true);
  });
});

describe("calculateRelevanceScore", () => {
  test("exact match scores highest (100 + field bonus)", () => {
    const score = calculateRelevanceScore(
      [{ field: "front", value: "Rice" } as const],
      "rice",
    );
    expect(score).toBe(103); // 100 (exact) + 3 (front field)
  });

  test("word boundary match scores high (50 + field bonus)", () => {
    const score = calculateRelevanceScore(
      [{ field: "front", value: "I like Rice" } as const],
      "rice",
    );
    expect(score).toBe(53); // 50 (word boundary) + 3 (front field)
  });

  test("word boundary at start gets extra bonus (50 + 10 + field)", () => {
    const score = calculateRelevanceScore(
      [{ field: "front", value: "rice is good" } as const],
      "rice",
    );
    expect(score).toBe(63); // 50 (word boundary) + 10 (starts with) + 3 (front)
  });

  test("substring match scores low (5 + field bonus)", () => {
    const score = calculateRelevanceScore(
      [{ field: "front", value: "reasonably priced" } as const],
      "rice",
    );
    expect(score).toBe(8); // 5 (substring) + 3 (front field)
  });

  test("multiple substring matches still score lower than single exact match", () => {
    const exactScore = calculateRelevanceScore(
      [{ field: "front", value: "Rice" } as const],
      "rice",
    );
    const substringScore = calculateRelevanceScore(
      [
        { field: "front", value: "reasonably priced" } as const,
        { field: "example", value: "the menu is reasonably priced" } as const,
      ],
      "rice",
    );

    expect(exactScore).toBeGreaterThan(substringScore);
    expect(exactScore).toBe(103); // 100 + 3
    expect(substringScore).toBe(14); // (5 + 3) + (5 + 1)
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

    expect(nameScore).toBe(105); // 100 + 5
    expect(frontScore).toBe(103); // 100 + 3
    expect(backScore).toBe(103); // 100 + 3
    expect(descScore).toBe(102); // 100 + 2
    expect(exampleScore).toBe(101); // 100 + 1
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
