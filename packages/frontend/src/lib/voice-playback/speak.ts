import { camelCaseToHuman } from "../string/camel-case-to-human.ts";
import EasySpeech from "easy-speech";

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

export const speak = async (text: string, language: SpeakLanguageEnum) => {
  if (!isSpeechSynthesisSupported) {
    return;
  }

  try {
    await EasySpeech.init({ maxTimeout: 5000, interval: 250 });

    // Get voices for the specific language
    // @ts-expect-error
    const voices = EasySpeech.filterVoices({ language });
    if (!voices.length) {
      console.warn(`No voice found for language ${language}`);
      return;
    }

    await EasySpeech.speak({
      text,
      voice: voices[0], // Use the first available voice for this language
    });
  } catch (e) {
    console.error("Speech synthesis failed:", e);
  }
};
