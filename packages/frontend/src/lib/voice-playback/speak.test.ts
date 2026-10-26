import { SpeakLanguage } from "api";
import { describe, expect, it } from "vitest";
import { arrayIntersection, highQualityVoices } from "./highQualityVoices.ts";
import { languageKeyToHuman, SpeakLanguageEnum } from "./speak.ts";

describe("Mexican Spanish speech", () => {
  it("uses es-MX across the API and browser voice configuration", () => {
    expect(SpeakLanguage.MexicanSpanish).toBe("es-MX");
    expect(SpeakLanguageEnum.MexicanSpanish).toBe("es-MX");
    expect(languageKeyToHuman("MexicanSpanish")).toBe("Mexican Spanish");
    expect(highQualityVoices[SpeakLanguageEnum.MexicanSpanish]).toContain(
      "Microsoft Dalia Online (Natural) - Spanish (Mexico)",
    );
  });
});

describe("arrayIntersection", () => {
  it("keeps the preferred voice order instead of the installed order", () => {
    expect(
      arrayIntersection(["Audrey", "Thomas"], ["Jacques", "Thomas", "Audrey"]),
    ).toEqual(["Audrey", "Thomas"]);
  });
});
