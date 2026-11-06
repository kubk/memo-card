import { type SpeakLanguage } from "api";
import { speak } from "../../../lib/voice-playback/speak.ts";
import { VoicePlayer } from "./create-voice-player.ts";
import { action, makeAutoObservable } from "mobx";

export class BrowserWebSpeechApiPlayer implements VoicePlayer {
  isPlaying = false;
  private playbackVersion = 0;

  constructor(
    private text: string,
    private language: SpeakLanguage,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  preload() {}

  async play() {
    const version = ++this.playbackVersion;
    try {
      await speak(
        this.text,
        this.language,
        action(() => {
          if (version === this.playbackVersion) {
            this.isPlaying = true;
          }
        }),
      );
    } finally {
      if (version === this.playbackVersion) {
        this.isPlaying = false;
      }
    }
  }
}
