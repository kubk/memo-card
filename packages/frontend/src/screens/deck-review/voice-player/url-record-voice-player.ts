import { VoicePlayer } from "./create-voice-player.ts";
import { voicePlayerCallbackQueue } from "./voice-player-callback-queue.ts";

export class UrlRecordVoicePlayer implements VoicePlayer {
  private audio: HTMLAudioElement;

  constructor(url: string) {
    this.audio = new Audio(url);
    this.audio.preload = "none";
    voicePlayerCallbackQueue.add(() => this.audio.load());
  }

  play() {
    this.audio.play();
  }
}
