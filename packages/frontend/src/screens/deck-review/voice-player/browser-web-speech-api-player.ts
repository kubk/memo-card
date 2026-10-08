import { speak, SpeakLanguageEnum } from "../../../lib/voice-playback/speak.ts";
import { VoicePlayer } from "./create-voice-player.ts";
import { action, makeAutoObservable, runInAction } from "mobx";

export class BrowserWebSpeechApiPlayer implements VoicePlayer {
  isPlaying = false;
  private playbackVersion = 0;

  constructor(
    private text: string,
    private language: SpeakLanguageEnum,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

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
      runInAction(() => {
        if (version === this.playbackVersion) {
          this.isPlaying = false;
        }
      });
    }
  }
}
