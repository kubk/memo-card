import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SpeakLanguage } from "api";
import { speak } from "../../../lib/voice-playback/speak.ts";
import { BrowserWebSpeechApiPlayer } from "./browser-web-speech-api-player.ts";
import { UrlRecordVoicePlayer } from "./url-record-voice-player.ts";
import { createGoogleTtsVoicePlayer } from "./google-tts-voice-player.ts";
import { voicePlayerCallbackQueue } from "./voice-player-callback-queue.ts";
import { unlockPlaybackOnFirstTap } from "../../../lib/voice-playback/shared-audio.ts";
import { unlockSpeechSynthesis } from "../../../lib/voice-playback/speech-synthesis.ts";

vi.mock("../../../lib/voice-playback/speak.ts", () => ({
  speak: vi.fn(),
}));

vi.mock("../../../lib/voice-playback/speech-synthesis.ts", () => ({
  unlockSpeechSynthesis: vi.fn(),
}));

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function capturePlayedElements(play: () => Promise<void>) {
  const elements: HTMLMediaElement[] = [];
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(
    function (this: HTMLMediaElement) {
      elements.push(this);
      return play();
    },
  );
  return elements;
}

describe("recorded audio playback", () => {
  it("plays every recording through one element and tracks its events", () => {
    const played = capturePlayedElements(() => Promise.resolve());
    const first = new UrlRecordVoicePlayer("https://media.test/first.mp3");
    const second = new UrlRecordVoicePlayer("https://media.test/second.mp3");

    first.play();
    const audio = played[0];
    for (const event of ["pause", "ended", "error", "emptied"]) {
      audio.dispatchEvent(new Event("playing"));
      expect(first.isPlaying).toBe(true);
      expect(second.isPlaying).toBe(false);
      audio.dispatchEvent(new Event(event));
      expect(first.isPlaying).toBe(false);
    }

    second.play();
    expect(played).toEqual([audio, audio]);
    expect(audio.src).toBe("https://media.test/second.mp3");
    audio.dispatchEvent(new Event("playing"));
    expect(first.isPlaying).toBe(false);
    expect(second.isPlaying).toBe(true);
  });

  it("loads the recording only when preloaded", () => {
    const queue = vi
      .spyOn(voicePlayerCallbackQueue, "add")
      .mockImplementation((load) => load());
    const player = new UrlRecordVoicePlayer("recording.mp3");
    expect(queue).not.toHaveBeenCalled();

    player.preload();
    player.preload();

    expect(queue).toHaveBeenCalledOnce();
    expect(HTMLMediaElement.prototype.load).toHaveBeenCalledOnce();
  });

  it("handles rejected playback", async () => {
    capturePlayedElements(() =>
      Promise.reject(new DOMException("Blocked", "NotAllowedError")),
    );
    const player = new UrlRecordVoicePlayer("https://media.test/blocked.mp3");

    await player.play();
    expect(player.isPlaying).toBe(false);
  });
});

describe("audio unlock", () => {
  it("unlocks audio and speech on the first tap that allows playback", async () => {
    const errors = ["NotAllowedError", "AbortError"];
    const played = capturePlayedElements(() =>
      Promise.reject(new DOMException("Rejected", errors.shift())),
    );
    unlockPlaybackOnFirstTap();

    const tap = async (type: string) => {
      document.dispatchEvent(new Event(type));
      await new Promise((resolve) => setTimeout(resolve));
    };
    await tap("keydown");
    await tap("touchend");
    await tap("click");

    expect(played).toHaveLength(2);
    expect(played[1].src).toMatch(/^data:audio\/wav;base64,/);
    expect(unlockSpeechSynthesis).toHaveBeenCalledOnce();
  });
});

describe("speech synthesis playback", () => {
  it("tracks actual speech start and end events", async () => {
    let finish!: () => void;
    vi.mocked(speak).mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
    );
    const player = new BrowserWebSpeechApiPlayer("สีเขียว", SpeakLanguage.Thai);
    const playback = player.play();
    const onStart = vi.mocked(speak).mock.lastCall![2]!;

    expect(player.isPlaying).toBe(false);
    onStart();
    expect(player.isPlaying).toBe(true);
    finish();
    await playback;
    expect(player.isPlaying).toBe(false);
  });

  it("returns to idle if speech cannot start", async () => {
    vi.mocked(speak).mockResolvedValue(undefined);
    const player = new BrowserWebSpeechApiPlayer("สีเขียว", SpeakLanguage.Thai);
    await player.play();
    expect(player.isPlaying).toBe(false);
    await player.play();
    expect(player.isPlaying).toBe(false);
  });
});

describe("Google TTS playback", () => {
  it("plays through the shared element without preloading", () => {
    const queue = vi.spyOn(voicePlayerCallbackQueue, "add");
    const played = capturePlayedElements(() => Promise.resolve());
    const first = createGoogleTtsVoicePlayer("en-US", "Fierce");
    const second = createGoogleTtsVoicePlayer("en-US", "Fierce");

    first.preload();
    second.play();

    expect(queue).not.toHaveBeenCalled();
    expect(played).toHaveLength(1);
    expect(played[0].src).toBe(
      "https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=Fierce",
    );
    played[0].dispatchEvent(new Event("playing"));
    expect(first.isPlaying).toBe(true);
    expect(second.isPlaying).toBe(true);
    played[0].dispatchEvent(new Event("ended"));
    expect(first.isPlaying).toBe(false);
  });
});
