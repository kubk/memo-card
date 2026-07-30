import { describe, expect, it } from "vitest";
import { parseDate } from "./parse-date.ts";

describe("parseDate", () => {
  it.each([null, undefined, "", "invalid-date", "12345"])(
    "returns null for %s",
    (value) => {
      expect(parseDate(value)).toBeNull();
    },
  );

  it("parses ISO dates with a timezone", () => {
    const date = parseDate("2023-04-10T15:30:00.123Z");

    expect(date?.toISOString()).toBe("2023-04-10T15:30:00.123Z");
  });

  it("parses SQL dates in local time", () => {
    const date = parseDate("2023-04-10 15:30:00");

    expect(date?.getFullYear()).toBe(2023);
    expect(date?.getMonth()).toBe(3);
    expect(date?.getDate()).toBe(10);
    expect(date?.getHours()).toBe(15);
    expect(date?.getMinutes()).toBe(30);
  });

  it("parses date-only values in local time", () => {
    const date = parseDate("2023-04-01");

    expect(date?.getFullYear()).toBe(2023);
    expect(date?.getMonth()).toBe(3);
    expect(date?.getDate()).toBe(1);
  });

  it.each([
    "2023-13-45T25:70:00.000Z",
    "2023-13-45 25:70:00",
    "2023-02-29T12:00:00Z",
  ])("rejects malformed date %s", (value) => {
    expect(parseDate(value)).toBeNull();
  });

  it("accepts leap days", () => {
    expect(parseDate("2024-02-29T12:00:00Z")?.getUTCDate()).toBe(29);
  });
});
