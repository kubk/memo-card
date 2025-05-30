import { expect, test } from "vitest";
import { arrayDifference } from "./array-difference.ts";

test("array-difference", () => {
  expect(arrayDifference([1, 2, 3, 4, 5], [3, 4, 5, 6, 7])).toEqual([1, 2]);

  expect(arrayDifference([1, 2, 3], [3])).toEqual([1, 2]);

  expect(arrayDifference([3], [1, 2, 3])).toEqual([]);
});
