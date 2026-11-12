import { makeAutoObservable } from "mobx";
import { unlockSpeechSynthesis } from "./speech-synthesis.ts";

const silentClipUrl =
  "data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==";

const unlockEvents = ["touchend", "click", "keydown"];

// Android WebView and iOS let an audio element play without a gesture only
// after it played during one. All recordings share one element unlocked on the
// first tap, so a card shown from Telegram's main button still plays
class SharedAudio {
  private audio = new Audio();
  private url: string | null = null;
  private isAudioPlaying = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    for (const event of ["playing", "pause", "ended", "error", "emptied"]) {
      this.audio.addEventListener(event, () => {
        this.setIsAudioPlaying(event === "playing");
      });
    }
  }

  get playingUrl() {
    return this.isAudioPlaying ? this.url : null;
  }

  private setIsAudioPlaying(isPlaying: boolean) {
    this.isAudioPlaying = isPlaying;
  }

  async play(url: string) {
    if (this.url !== url) {
      this.url = url;
      this.isAudioPlaying = false;
      this.audio.src = url;
    }
    try {
      await this.audio.play();
    } catch {
      // Blocked without a gesture or interrupted by the next card
    }
  }

  // Resolves to false when the browser did not count the event as a gesture
  async unlock() {
    if (!this.audio.paused) {
      return true;
    }
    this.url = null;
    this.audio.src = silentClipUrl;
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      // Any other error means play() ran during the gesture and unlocked the
      // element, for example when a card's audio replaced the silent clip
      return !(
        error instanceof DOMException && error.name === "NotAllowedError"
      );
    }
  }
}

export const sharedAudio = new SharedAudio();

export function unlockPlaybackOnFirstTap() {
  let isSpeechUnlocked = false;
  const unlock = () => {
    toggleListeners(false);
    if (!isSpeechUnlocked) {
      isSpeechUnlocked = true;
      unlockSpeechSynthesis();
    }
    sharedAudio.unlock().then((isUnlocked) => {
      if (!isUnlocked) {
        toggleListeners(true);
      }
    });
  };
  const toggleListeners = (isListening: boolean) => {
    for (const event of unlockEvents) {
      if (isListening) {
        document.addEventListener(event, unlock, { capture: true });
      } else {
        document.removeEventListener(event, unlock, { capture: true });
      }
    }
  };
  toggleListeners(true);
}
