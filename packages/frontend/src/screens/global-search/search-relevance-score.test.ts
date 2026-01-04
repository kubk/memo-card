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
    const matches = [{ field: "front", value: "Rice" }];
    const score = calculateRelevanceScore(matches, "rice");
    expect(score).toBe(103); // 100 (exact) + 3 (front field)
  });

  test("word boundary match scores high (50 + field bonus)", () => {
    const matches = [{ field: "front", value: "I like Rice" }];
    const score = calculateRelevanceScore(matches, "rice");
    expect(score).toBe(53); // 50 (word boundary) + 3 (front field)
  });

  test("word boundary at start gets extra bonus (50 + 10 + field)", () => {
    const matches = [{ field: "front", value: "rice is good" }];
    const score = calculateRelevanceScore(matches, "rice");
    expect(score).toBe(63); // 50 (word boundary) + 10 (starts with) + 3 (front)
  });

  test("substring match scores low (5 + field bonus)", () => {
    const matches = [{ field: "front", value: "reasonably priced" }];
    const score = calculateRelevanceScore(matches, "rice");
    expect(score).toBe(8); // 5 (substring) + 3 (front field)
  });

  test("multiple substring matches still score lower than single exact match", () => {
    const exactMatch = [{ field: "front", value: "Rice" }];
    const multipleSubstrings = [
      { field: "front", value: "reasonably priced" },
      { field: "example", value: "the menu is reasonably priced" },
    ];

    const exactScore = calculateRelevanceScore(exactMatch, "rice");
    const substringScore = calculateRelevanceScore(multipleSubstrings, "rice");

    expect(exactScore).toBeGreaterThan(substringScore);
    expect(exactScore).toBe(103); // 100 + 3
    expect(substringScore).toBe(14); // (5 + 3) + (5 + 1)
  });

  test("field importance: name > front > back > description > example", () => {
    const nameMatch = [{ field: "name", value: "test" }];
    const frontMatch = [{ field: "front", value: "test" }];
    const backMatch = [{ field: "back", value: "test" }];
    const descMatch = [{ field: "description", value: "test" }];
    const exampleMatch = [{ field: "example", value: "test" }];

    const nameScore = calculateRelevanceScore(nameMatch, "test");
    const frontScore = calculateRelevanceScore(frontMatch, "test");
    const backScore = calculateRelevanceScore(backMatch, "test");
    const descScore = calculateRelevanceScore(descMatch, "test");
    const exampleScore = calculateRelevanceScore(exampleMatch, "test");

    expect(nameScore).toBe(105); // 100 + 5
    expect(frontScore).toBe(103); // 100 + 3
    expect(backScore).toBe(103); // 100 + 3
    expect(descScore).toBe(102); // 100 + 2
    expect(exampleScore).toBe(101); // 100 + 1
  });

  test("no match returns 0", () => {
    const matches = [{ field: "front", value: "hello world" }];
    const score = calculateRelevanceScore(matches, "rice");
    expect(score).toBe(0);
  });

  test("Rice card ranks higher than reasonably priced card", () => {
    // Simulating the original bug scenario
    const riceCard = [
      { field: "front", value: "Rice" },
      { field: "back", value: "ข้าว" },
    ];

    const pricedCard = [
      { field: "front", value: "reasonably priced" },
      { field: "back", value: "адекватная цена; ни дорого, ни дёшево" },
      {
        field: "example",
        value:
          "I think their menu is reasonably priced in comparison to other restaurants",
      },
    ];

    const riceScore = calculateRelevanceScore(riceCard, "rice");
    const pricedScore = calculateRelevanceScore(pricedCard, "rice");

    expect(riceScore).toBeGreaterThan(pricedScore);
  });
});
