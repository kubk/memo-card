import { VoicePlayer } from "./create-voice-player.ts";
import { voicePlayerCallbackQueue } from "./voice-player-callback-queue.ts";
import { makeAutoObservable } from "mobx";
import { toViewerMediaUrls } from "../../../lib/urls/proxy-urls.ts";
import { sharedAudio } from "../../../lib/voice-playback/shared-audio.ts";

export class UrlRecordVoicePlayer implements VoicePlayer {
  private url: string;
  private canPreload: boolean;
  private preloadAudio?: HTMLAudioElement;

  constructor(url: string, { canPreload = true } = {}) {
    this.url = toViewerMediaUrls(url);
    this.canPreload = canPreload;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isPlaying() {
    return sharedAudio.playingUrl === this.url;
  }

  preload() {
    if (!this.canPreload || this.preloadAudio) {
      return;
    }
    const audio = new Audio(this.url);
    audio.preload = "none";
    this.preloadAudio = audio;
    voicePlayerCallbackQueue.add(() => audio.load());
  }

  play() {
    return sharedAudio.play(this.url);
  }
}
