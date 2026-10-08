import { VoicePlayer } from "./create-voice-player.ts";
import { voicePlayerCallbackQueue } from "./voice-player-callback-queue.ts";
import { action, makeAutoObservable } from "mobx";

export class UrlRecordVoicePlayer implements VoicePlayer {
  private audio: HTMLAudioElement;
  isPlaying = false;

  constructor(url: string) {
    this.audio = new Audio(url);
    makeAutoObservable(this, {}, { autoBind: true });
    for (const event of ["playing", "pause", "ended", "error", "emptied"]) {
      this.audio.addEventListener(
        event,
        action(() => {
          this.isPlaying = event === "playing";
        }),
      );
    }
    this.audio.preload = "none";
    voicePlayerCallbackQueue.add(() => this.audio.load());
  }

  play() {
    this.audio.play().catch(
      action(() => {
        this.isPlaying = false;
      }),
    );
  }
}
