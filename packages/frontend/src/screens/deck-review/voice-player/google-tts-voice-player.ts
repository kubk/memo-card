import { VoicePlayer } from "./create-voice-player.ts";
import { voicePlayerCallbackQueue } from "./voice-player-callback-queue.ts";
import { action, makeAutoObservable } from "mobx";

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
  isPlaying = false;

  constructor(language: string, text: string) {
    insertMetaNoReferrerToDom();
    const cacheKey = `${language} ${text}`;
    if (audioCache.has(cacheKey)) {
      this.audio = audioCache.get(cacheKey)!;
    } else {
      this.audio = new Audio(buildGoogleTtsUrl(language, text));
      this.audio.preload = "none";
      voicePlayerCallbackQueue.add(() => this.audio.load());
      audioCache.set(cacheKey, this.audio);
    }
    makeAutoObservable(this, {}, { autoBind: true });
    this.isPlaying = !this.audio.paused && !this.audio.ended;
    for (const event of ["playing", "pause", "ended", "error", "emptied"]) {
      this.audio.addEventListener(
        event,
        action(() => {
          this.isPlaying = event === "playing";
        }),
      );
    }
  }

  play() {
    this.audio.play().catch(
      action(() => {
        this.isPlaying = false;
      }),
    );
  }
}
