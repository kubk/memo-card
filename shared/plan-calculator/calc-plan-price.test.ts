import { test, expect } from "vitest";
import { calcPlanPrice } from "./calc-plan-price.ts";

test("calc plan price", () => {
  const pricePerMonth = 5;

  expect(calcPlanPrice(pricePerMonth, 1)).toBe(pricePerMonth);
  expect(calcPlanPrice(pricePerMonth, 6)).toBe(25);
  expect(calcPlanPrice(pricePerMonth, 12)).toBe(45);
});
