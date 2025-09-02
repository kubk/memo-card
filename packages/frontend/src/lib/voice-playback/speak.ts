import { camelCaseToHuman } from "../string/camel-case-to-human.ts";
import EasySpeech from "easy-speech";

export async function loadHighQualityVoices() {
  console.log("Loading high quality voices");
  return import("./highQualityVoices.ts");
}

export enum SpeakLanguageEnum {
  USEnglish = "en-US",
  Italian = "it-IT",
  Swedish = "sv-SE",
  Malay = "ms-MY",
  German = "de-DE",
  UKEnglish = "en-GB",
  Hebrew = "he-IL",
  Indonesian = "id-ID",
  French = "fr-FR",
  Bulgarian = "bg-BG",
  Spanish = "es-ES",
  Finnish = "fi-FI",
  Japanese = "ja-JP",
  Romanian = "ro-RO",
  Portuguese = "pt-PT",
  BrazilianPortuguese = "pt-BR",
  Thai = "th-TH",
  Croatian = "hr-HR",
  Slovak = "sk-SK",
  Hindi = "hi-IN",
  Ukrainian = "uk-UA",
  Chinese = "zh-CN",
  Vietnamese = "vi-VN",
  Arabic = "ar-001",
  Greek = "el-GR",
  Russian = "ru-RU",
  Danish = "da-DK",
  Hungarian = "hu-HU",
  Dutch = "nl-NL",
  Turkish = "tr-TR",
  Korean = "ko-KR",
  Polish = "pl-PL",
  Czech = "cs-CZ",
}

export const languageKeyToHuman = (str: string): string => {
  if (str === "UKEnglish") {
    return "UK English";
  }
  if (str === "USEnglish") {
    return "US English";
  }
  return camelCaseToHuman(str);
};

export const isSpeechSynthesisSupported =
  "speechSynthesis" in window &&
  typeof SpeechSynthesisUtterance !== "undefined";

// Cache for high quality voices by language
const voiceCache = new Map<SpeakLanguageEnum, SpeechSynthesisVoice | null>();

export const speak = async (text: string, language: SpeakLanguageEnum) => {
  if (!isSpeechSynthesisSupported) {
    return;
  }

  try {
    await EasySpeech.init({ maxTimeout: 5000, interval: 250 });

    const voicesFamily = EasySpeech.filterVoices({ language });
    const exactVoices = voicesFamily.filter((v) => v.lang === language);

    let voice = exactVoices[0] || voicesFamily[0];

    if (voiceCache.has(language)) {
      const cachedVoice = voiceCache.get(language);
      if (cachedVoice) {
        voice = cachedVoice;
        console.log("Using cached high quality voice", voice);
      }
    } else {
      const { highQualityVoices, arrayIntersection } =
        await loadHighQualityVoices();

      // Search for high quality voice and cache the result
      const hqvByLanguage = highQualityVoices[language] || [];
      const existingHqv = arrayIntersection(
        hqvByLanguage,
        exactVoices.map((v) => v.name),
      );
      const foundHqv = exactVoices.find((v) => v.name === existingHqv[0]);
      if (foundHqv) {
        voice = foundHqv;
        voiceCache.set(language, foundHqv);
        console.log("Found and cached high quality voice", voice);
      } else {
        console.warn("No high quality voice found");
      }
    }

    if (!voice) {
      console.warn(`No voice found for language ${language}`);
      return;
    }

    await EasySpeech.speak({
      text,
      voice,
    });
  } catch (e) {
    console.error("Speech synthesis failed:", e);
  }
};
