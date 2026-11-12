import { UrlRecordVoicePlayer } from "./url-record-voice-player.ts";

// Circumvent Google CORS
let isMetaTagInserted = false;
const insertMetaNoReferrerToDom = () => {
  if (isMetaTagInserted) {
    return;
  }
  const metaTag = document.createElement("meta");
  metaTag.setAttribute("name", "referrer");
  metaTag.setAttribute("content", "no-referrer");
  document.head.appendChild(metaTag);
  isMetaTagInserted = true;
};

const buildGoogleTtsUrl = (language: string, text: string) => {
  const encodedLanguage = encodeURIComponent(language);
  const encodedText = encodeURIComponent(text);
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodedLanguage}&client=tw-ob&q=${encodedText}`;
};

// translate_tts responses are no-store, so a preload would only download the
// clip a second time before the shared element plays it
export function createGoogleTtsVoicePlayer(language: string, text: string) {
  insertMetaNoReferrerToDom();
  return new UrlRecordVoicePlayer(buildGoogleTtsUrl(language, text), {
    canPreload: false,
  });
}
