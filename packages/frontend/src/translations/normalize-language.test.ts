import { describe, expect, it } from "vitest";
import { normalizeLanguage } from "./normalize-language.ts";

describe("normalizeLanguage", () => {
  it.each([
    ["ru", "ru"],
    ["uk-UA", "uk"],
    ["fa_IR", "fa"],
    ["pt-BR", "pt-br"],
    ["pt", "pt-br"],
    ["es-MX", "es"],
    ["en-US", "en"],
  ] as const)("maps %s to %s", (language, expected) => {
    expect(normalizeLanguage(language)).toBe(expected);
  });

  it.each([undefined, null, "", "th", "invalid"])(
    "falls back to English for %s",
    (language) => {
      expect(normalizeLanguage(language)).toBe("en");
    },
  );
});
