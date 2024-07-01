import { test, expect } from "vitest";
import { formatDiscount } from "./format-discount";

test("format discount", () => {
  expect(formatDiscount(0)).toBe(null);
  expect(formatDiscount(0.3333)).toBe("-33%");
  expect(formatDiscount(0.5)).toBe("-50%");
});
