import { describe, it, expect } from "vitest";
import { formatInterval } from "./format-interval";

describe("formatInterval", () => {
  describe("English locale", () => {
    const language = "en";

    it("should format minutes correctly", () => {
      expect(formatInterval(0.01, language)).toBe("14m");
      expect(formatInterval(0.03, language)).toBe("43m");
      expect(formatInterval(0.04, language)).toBe("58m");
    });

    it("should format hours correctly", () => {
      expect(formatInterval(0.05, language)).toBe("1h");
      expect(formatInterval(0.5, language)).toBe("12h");
      expect(formatInterval(0.9, language)).toBe("22h");
    });

    it("should format days correctly", () => {
      expect(formatInterval(1, language)).toBe("1d");
      expect(formatInterval(3, language)).toBe("3d");
      expect(formatInterval(9, language)).toBe("9d");
    });

    it("should format weeks correctly", () => {
      expect(formatInterval(10, language)).toBe("1w");
      expect(formatInterval(14, language)).toBe("2w");
      expect(formatInterval(21, language)).toBe("3w");
      expect(formatInterval(28, language)).toBe("4w");
    });

    it("should format months correctly", () => {
      expect(formatInterval(30, language)).toBe("1mo");
      expect(formatInterval(60, language)).toBe("2mo");
      expect(formatInterval(180, language)).toBe("6mo");
      expect(formatInterval(330, language)).toBe("11mo");
    });

    it("should format years correctly", () => {
      expect(formatInterval(365, language)).toBe("1y");
      expect(formatInterval(730, language)).toBe("2y");
      expect(formatInterval(1825, language)).toBe("5y");
    });
  });

  describe("Russian locale", () => {
    const language = "ru";

    it("should format minutes correctly", () => {
      expect(formatInterval(0.01, language)).toBe("14 мин");
      expect(formatInterval(0.03, language)).toBe("43 мин");
      expect(formatInterval(0.04, language)).toBe("58 мин");
    });

    it("should format hours correctly", () => {
      expect(formatInterval(0.05, language)).toBe("1 ч");
      expect(formatInterval(0.5, language)).toBe("12 ч");
      expect(formatInterval(0.9, language)).toBe("22 ч");
    });

    it("should format days correctly", () => {
      expect(formatInterval(1, language)).toBe("1 дн");
      expect(formatInterval(3, language)).toBe("3 дн");
      expect(formatInterval(9, language)).toBe("9 дн");
    });

    it("should format weeks correctly", () => {
      expect(formatInterval(10, language)).toBe("1 нед");
      expect(formatInterval(14, language)).toBe("2 нед");
      expect(formatInterval(21, language)).toBe("3 нед");
      expect(formatInterval(28, language)).toBe("4 нед");
    });

    it("should format months correctly", () => {
      expect(formatInterval(30, language)).toBe("1 мес");
      expect(formatInterval(60, language)).toBe("2 мес");
      expect(formatInterval(180, language)).toBe("6 мес");
      expect(formatInterval(330, language)).toBe("11 мес");
    });

    it("should format years correctly", () => {
      expect(formatInterval(365, language)).toBe("1 г");
      expect(formatInterval(730, language)).toBe("2 г");
      expect(formatInterval(1825, language)).toBe("5 л");
    });
  });

  describe("Ukrainian locale", () => {
    const language = "uk";

    it("should format minutes correctly", () => {
      expect(formatInterval(0.01, language)).toBe("14 хв");
      expect(formatInterval(0.03, language)).toBe("43 хв");
      expect(formatInterval(0.04, language)).toBe("58 хв");
    });

    it("should format hours correctly", () => {
      expect(formatInterval(0.05, language)).toBe("1 год");
      expect(formatInterval(0.5, language)).toBe("12 год");
      expect(formatInterval(0.9, language)).toBe("22 год");
    });

    it("should format days correctly", () => {
      expect(formatInterval(1, language)).toBe("1 дн");
      expect(formatInterval(3, language)).toBe("3 дн");
      expect(formatInterval(9, language)).toBe("9 дн");
    });

    it("should format weeks correctly", () => {
      expect(formatInterval(10, language)).toBe("1 тиж");
      expect(formatInterval(14, language)).toBe("2 тиж");
      expect(formatInterval(21, language)).toBe("3 тиж");
      expect(formatInterval(28, language)).toBe("4 тиж");
    });

    it("should format months correctly", () => {
      expect(formatInterval(30, language)).toBe("1 міс");
      expect(formatInterval(60, language)).toBe("2 міс");
      expect(formatInterval(180, language)).toBe("6 міс");
      expect(formatInterval(330, language)).toBe("11 міс");
    });

    it("should format years correctly", () => {
      expect(formatInterval(365, language)).toBe("1 р");
      expect(formatInterval(730, language)).toBe("2 р");
      expect(formatInterval(1825, language)).toBe("5 р");
    });
  });

  describe("edge cases", () => {
    it("should handle very small intervals", () => {
      expect(formatInterval(0.0001, "en")).toBe("0m");
      expect(formatInterval(0.0006, "en")).toBe("1m");
    });
  });
});
