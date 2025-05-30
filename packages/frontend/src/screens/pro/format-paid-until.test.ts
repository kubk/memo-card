import { describe, expect, it, vi } from "vitest";
import { formatPaidUntil } from "./format-paid-until.tsx";

describe("formatPaidUntil", () => {
  it("returns a formatted date when a valid ISO date string is provided", () => {
    vi.stubGlobal("navigator", { language: "en-US" });
    const input = "2023-04-01";
    const expected = "April 1, 2023";
    expect(formatPaidUntil(input)).toBe(expected);
  });
});
