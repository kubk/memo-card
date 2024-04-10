import { describe, it, expect, vi } from "vitest";
import { formatPaidUntil } from "./format-paid-until.tsx";

describe("formatPaidUntil", () => {
  it("returns a formatted date when a valid ISO date string is provided", () => {
    vi.stubGlobal("navigator", { language: "en-US" });
    const input = "2023-04-01";
    const expected = "April 1, 2023"; // Adjust the expected result based on your locale
    expect(formatPaidUntil(input)).toBe(expected);
  });
});
