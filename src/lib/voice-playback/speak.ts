import { reportHandledError } from "../rollbar/rollbar.tsx";

export enum SpeakLanguageEnum {
  AmericanEnglish = "en-US",
  Italian = "it-IT",
  Swedish = "sv-SE",
  CanadianFrench = "fr-CA",
  Malay = "ms-MY",
  German = "de-DE",
  BritishEnglish = "en-GB",
  Hebrew = "he-IL",
  AustralianEnglish = "en-AU",
  Indonesian = "id-ID",
  French = "fr-FR",
  Bulgarian = "bg-BG",
  Spanish = "es-ES",
  MexicanSpanish = "es-MX",
  Finnish = "fi-FI",
  BrazilianPortuguese = "pt-BR",
  BelgianDutch = "nl-BE",
  Japanese = "ja-JP",
  Romanian = "ro-RO",
  Portuguese = "pt-PT",
  Thai = "th-TH",
  Croatian = "hr-HR",
  Slovak = "sk-SK",
  Hindi = "hi-IN",
  Ukrainian = "uk-UA",
  MainlandChinaChinese = "zh-CN",
  Vietnamese = "vi-VN",
  ModernStandardArabic = "ar-001",
  TaiwaneseChinese = "zh-TW",
  Greek = "el-GR",
  Russian = "ru-RU",
  Danish = "da-DK",
  HongKongChinese = "zh-HK",
  Hungarian = "hu-HU",
  Dutch = "nl-NL",
  Turkish = "tr-TR",
  Korean = "ko-KR",
  Polish = "pl-PL",
  Czech = "cs-CZ",
}

export const speak = (text: string, language: SpeakLanguageEnum) => {
  const isSpeechSynthesisSupported =
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined";

  if (!isSpeechSynthesisSupported) {
    reportHandledError(
      `Speech synthesis is not supported in this browser. Browser info: ${navigator.userAgent}`,
    );
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;

  window.speechSynthesis.speak(utterance);
};
