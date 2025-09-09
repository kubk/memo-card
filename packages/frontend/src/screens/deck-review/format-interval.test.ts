import { describe, it, expect } from "vitest";
import { formatInterval } from "./format-interval";

describe("formatInterval", () => {
  describe("English locale", () => {
    const language = "en";

    it("should format minutes correctly", () => {
      expect(formatInterval(0.01, language)).toBe("14 m");
      expect(formatInterval(0.03, language)).toBe("43 m");
      expect(formatInterval(0.04, language)).toBe("58 m");
    });

    it("should format hours correctly", () => {
      expect(formatInterval(0.05, language)).toBe("1 h");
      expect(formatInterval(0.5, language)).toBe("12 h");
      expect(formatInterval(0.9, language)).toBe("22 h");
    });

    it("should format days correctly", () => {
      expect(formatInterval(1, language)).toBe("1 d");
      expect(formatInterval(3, language)).toBe("3 d");
      expect(formatInterval(6, language)).toBe("6 d");
    });

    it("should format weeks correctly", () => {
      expect(formatInterval(7, language)).toBe("1 w");
      expect(formatInterval(10, language)).toBe("1.4 w");
      expect(formatInterval(12, language)).toBe("1.7 w");
      expect(formatInterval(14, language)).toBe("2 w");
      expect(formatInterval(18, language)).toBe("2.6 w");
      expect(formatInterval(21, language)).toBe("3 w");
      expect(formatInterval(25, language)).toBe("3.6 w");
      expect(formatInterval(27, language)).toBe("3.9 w");
    });

    it("should format months correctly", () => {
      expect(formatInterval(28, language)).toBe("1 mo");
      expect(formatInterval(32, language)).toBe("1.1 mo");
      expect(formatInterval(35, language)).toBe("1.3 mo");
      expect(formatInterval(45, language)).toBe("1.6 mo");
      expect(formatInterval(60, language)).toBe("2.1 mo");
      expect(formatInterval(75, language)).toBe("2.7 mo");
      expect(formatInterval(90, language)).toBe("3.2 mo");
      expect(formatInterval(120, language)).toBe("4.3 mo");
      expect(formatInterval(150, language)).toBe("5.4 mo");
      expect(formatInterval(180, language)).toBe("6.4 mo");
      expect(formatInterval(270, language)).toBe("9.6 mo");
      expect(formatInterval(300, language)).toBe("10.7 mo");
      expect(formatInterval(330, language)).toBe("11.8 mo");
      expect(formatInterval(350, language)).toBe("12.5 mo");
    });

    it("should format years correctly", () => {
      expect(formatInterval(365, language)).toBe("1 y");
      expect(formatInterval(400, language)).toBe("1.1 y");
      expect(formatInterval(450, language)).toBe("1.2 y");
      expect(formatInterval(547, language)).toBe("1.5 y");
      expect(formatInterval(600, language)).toBe("1.6 y");
      expect(formatInterval(730, language)).toBe("2 y");
      expect(formatInterval(912, language)).toBe("2.5 y");
      expect(formatInterval(1095, language)).toBe("3 y");
      expect(formatInterval(1460, language)).toBe("4 y");
      expect(formatInterval(1825, language)).toBe("5 y");
      expect(formatInterval(2190, language)).toBe("6 y");
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
      expect(formatInterval(6, language)).toBe("6 дн");
    });

    it("should format weeks correctly", () => {
      expect(formatInterval(7, language)).toBe("1 нед");
      expect(formatInterval(10, language)).toBe("1.4 нед");
      expect(formatInterval(14, language)).toBe("2 нед");
      expect(formatInterval(18, language)).toBe("2.6 нед");
      expect(formatInterval(21, language)).toBe("3 нед");
      expect(formatInterval(25, language)).toBe("3.6 нед");
    });

    it("should format months correctly", () => {
      expect(formatInterval(28, language)).toBe("1 мес");
      expect(formatInterval(35, language)).toBe("1.3 мес");
      expect(formatInterval(45, language)).toBe("1.6 мес");
      expect(formatInterval(60, language)).toBe("2.1 мес");
      expect(formatInterval(90, language)).toBe("3.2 мес");
      expect(formatInterval(180, language)).toBe("6.4 мес");
      expect(formatInterval(330, language)).toBe("11.8 мес");
      expect(formatInterval(350, language)).toBe("12.5 мес");
    });

    it("should format years correctly", () => {
      expect(formatInterval(365, language)).toBe("1 г");
      expect(formatInterval(547, language)).toBe("1.5 г");
      expect(formatInterval(730, language)).toBe("2 г");
      expect(formatInterval(1095, language)).toBe("3 г");
      expect(formatInterval(1825, language)).toBe("5 г");
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
      expect(formatInterval(6, language)).toBe("6 дн");
    });

    it("should format weeks correctly", () => {
      expect(formatInterval(7, language)).toBe("1 тиж");
      expect(formatInterval(10, language)).toBe("1.4 тиж");
      expect(formatInterval(14, language)).toBe("2 тиж");
      expect(formatInterval(18, language)).toBe("2.6 тиж");
      expect(formatInterval(21, language)).toBe("3 тиж");
      expect(formatInterval(25, language)).toBe("3.6 тиж");
    });

    it("should format months correctly", () => {
      expect(formatInterval(28, language)).toBe("1 міс");
      expect(formatInterval(35, language)).toBe("1.3 міс");
      expect(formatInterval(45, language)).toBe("1.6 міс");
      expect(formatInterval(60, language)).toBe("2.1 міс");
      expect(formatInterval(90, language)).toBe("3.2 міс");
      expect(formatInterval(180, language)).toBe("6.4 міс");
      expect(formatInterval(330, language)).toBe("11.8 міс");
      expect(formatInterval(350, language)).toBe("12.5 міс");
    });

    it("should format years correctly", () => {
      expect(formatInterval(365, language)).toBe("1 р");
      expect(formatInterval(547, language)).toBe("1.5 р");
      expect(formatInterval(730, language)).toBe("2 р");
      expect(formatInterval(1095, language)).toBe("3 р");
      expect(formatInterval(1825, language)).toBe("5 р");
    });
  });

  describe("edge cases", () => {
    it("should handle very small intervals", () => {
      expect(formatInterval(0.0001, "en")).toBe("0 m");
      expect(formatInterval(0.0006, "en")).toBe("1 m");
    });

    it("should handle boundary transitions correctly", () => {
      // Day to week boundary (6 days vs 7 days)
      expect(formatInterval(6, "en")).toBe("6 d");
      expect(formatInterval(6.9, "en")).toBe("7 d"); // Rounds to 7 days, still in days range
      expect(formatInterval(7, "en")).toBe("1 w");
      expect(formatInterval(7.1, "en")).toBe("1 w"); // Should round to 1 w

      // Week to month boundary (27 days vs 28 days)
      expect(formatInterval(27, "en")).toBe("3.9 w");
      expect(formatInterval(27.9, "en")).toBe("4 w");
      expect(formatInterval(28, "en")).toBe("1 mo");
      expect(formatInterval(28.1, "en")).toBe("1 mo"); // Should round to 1 mo

      // Month to year boundary (around 365 days)
      expect(formatInterval(364, "en")).toBe("13 mo");
      expect(formatInterval(365, "en")).toBe("1 y");
      expect(formatInterval(366, "en")).toBe("1 y");
    });

    it("should show decimal precision for fractional values", () => {
      // Weeks with decimals
      expect(formatInterval(8.5, "en")).toBe("1.2 w");
      expect(formatInterval(15.5, "en")).toBe("2.2 w");

      // Months with decimals
      expect(formatInterval(40, "en")).toBe("1.4 mo");
      expect(formatInterval(70, "en")).toBe("2.5 mo");

      // Years with decimals
      expect(formatInterval(400, "en")).toBe("1.1 y");
      expect(formatInterval(500, "en")).toBe("1.4 y");
    });
  });

  describe("Arabic locale (RTL)", () => {
    const language = "ar";

    it("should format minutes correctly (RTL)", () => {
      expect(formatInterval(0.01, language)).toBe("دق 14");
      expect(formatInterval(0.03, language)).toBe("دق 43");
    });

    it("should format hours correctly (RTL)", () => {
      expect(formatInterval(0.05, language)).toBe("سا 1");
      expect(formatInterval(0.5, language)).toBe("سا 12");
    });

    it("should format days correctly (RTL)", () => {
      expect(formatInterval(1, language)).toBe("يوم 1");
      expect(formatInterval(3, language)).toBe("يوم 3");
    });

    it("should format weeks correctly (RTL)", () => {
      expect(formatInterval(7, language)).toBe("أسب 1");
      expect(formatInterval(10, language)).toBe("أسب 1.4");
    });

    it("should format months correctly (RTL)", () => {
      expect(formatInterval(28, language)).toBe("شهر 1");
      expect(formatInterval(35, language)).toBe("شهر 1.3");
    });

    it("should format years correctly (RTL)", () => {
      expect(formatInterval(365, language)).toBe("سنة 1");
      expect(formatInterval(547, language)).toBe("سنة 1.5");
    });
  });
});
