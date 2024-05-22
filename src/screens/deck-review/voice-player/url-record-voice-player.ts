import { VoicePlayer } from "./create-voice-player.ts";
import { preloadQueue } from "./preload-queue.ts";

export class UrlRecordVoicePlayer implements VoicePlayer {
  private audio: HTMLAudioElement;

  constructor(url: string) {
    this.audio = new Audio(url);
    this.audio.preload = "none";
    preloadQueue.add(() => this.audio.load());
  }

  play() {
    this.audio.play();
  }
}
