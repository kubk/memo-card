import { describe, expect, test, vi } from "vitest";
import { formatDays } from "./format-days.ts";

const lang = vi.hoisted(() => vi.fn());
vi.mock("./t.ts", () => {
  return {
    translator: {
      getLang: lang,
    },
  };
});

describe("format days", () => {
  test("russian", () => {
    lang.mockReturnValue("ru");

    expect(formatDays(0)).toBe("0 дней");
    expect(formatDays(1)).toBe("1 день");
    expect(formatDays(2)).toBe("2 дня");
    expect(formatDays(5)).toBe("5 дней");
    expect(formatDays(21)).toBe("21 день");
  });

  test("english", () => {
    lang.mockReturnValue("en");

    expect(formatDays(0)).toBe("0 days");
    expect(formatDays(1)).toBe("1 day");
    expect(formatDays(2)).toBe("2 days");
  });

  test("brazilian portuguese", () => {
    lang.mockReturnValue("pt-br");

    expect(formatDays(0)).toBe("0 dias");
    expect(formatDays(1)).toBe("1 dia");
    expect(formatDays(2)).toBe("2 dias");
  });
});
