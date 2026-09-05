import { SpeakLanguage } from "api";
import { describe, expect, it } from "vitest";
import { highQualityVoices } from "./highQualityVoices.ts";
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
