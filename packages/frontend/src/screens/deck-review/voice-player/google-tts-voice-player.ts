import { VoicePlayer } from "./create-voice-player.ts";
import { callbackQueue } from "./callback-queue.ts";

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

const audioCache = new Map<string, HTMLAudioElement>();

export class GoogleTtsVoicePlayer implements VoicePlayer {
  private audio: HTMLAudioElement;

  constructor(language: string, text: string) {
    insertMetaNoReferrerToDom();
    const cacheKey = `${language} ${text}`;
    if (audioCache.has(cacheKey)) {
      this.audio = audioCache.get(cacheKey)!;
      return;
    }
    this.audio = new Audio(buildGoogleTtsUrl(language, text));
    this.audio.preload = "none";
    callbackQueue.add(() => this.audio.load());
    audioCache.set(cacheKey, this.audio);
  }

  play() {
    this.audio.play();
  }
}
