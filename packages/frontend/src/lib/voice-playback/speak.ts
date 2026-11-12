import EasySpeech from "easy-speech";
import { type SpeakLanguage } from "api";
import { isSpeechSynthesisSupported } from "./speech-synthesis.ts";

export async function loadHighQualityVoices() {
  console.log("Loading high quality voices");
  return import("./highQualityVoices.ts");
}

export const languageKeyToHuman = (str: string): string => {
  if (str === "UKEnglish") {
    return "UK English";
  }
  if (str === "USEnglish") {
    return "US English";
  }
  return str.replace(/([A-Z])/g, " $1").trimStart();
};

export const getVoicesByLanguage = (
  language: string,
): SpeechSynthesisVoice[] => {
  const langCode = language.split(/[-_]+/g)[0].toLocaleLowerCase();

  return EasySpeech.voices().filter((voice) => {
    const compareLang = voice.lang.toLocaleLowerCase();
    return (
      compareLang === langCode ||
      compareLang.includes(`${langCode}-`) ||
      compareLang.includes(`${langCode}_`)
    );
  });
};

const voiceCache = new Map<SpeakLanguage, SpeechSynthesisVoice | null>();

export const speak = async (
  text: string,
  language: SpeakLanguage,
  onStart?: () => void,
) => {
  if (!isSpeechSynthesisSupported) {
    return;
  }

  try {
    await EasySpeech.init({ maxTimeout: 5000, interval: 250 });

    const voicesFamily = getVoicesByLanguage(language);
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
      start: onStart,
    });
  } catch (e) {
    console.error("Speech synthesis failed:", e);
  }
};
