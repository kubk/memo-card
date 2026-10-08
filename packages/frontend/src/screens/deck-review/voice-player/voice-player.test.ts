import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { speak, SpeakLanguageEnum } from "../../../lib/voice-playback/speak.ts";
import { BrowserWebSpeechApiPlayer } from "./browser-web-speech-api-player.ts";
import { UrlRecordVoicePlayer } from "./url-record-voice-player.ts";
import { GoogleTtsVoicePlayer } from "./google-tts-voice-player.ts";
import { voicePlayerCallbackQueue } from "./voice-player-callback-queue.ts";

vi.mock("../../../lib/voice-playback/speak.ts", () => ({
  speak: vi.fn(),
  SpeakLanguageEnum: { Thai: "th-TH" },
}));

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("recorded audio playback", () => {
  it("tracks playing, pause, completion, and failure events", () => {
    const audio = new Audio();
    vi.stubGlobal(
      "Audio",
      class {
        constructor() {
          return audio;
        }
      },
    );
    const player = new UrlRecordVoicePlayer("recording.mp3");

    for (const event of ["pause", "ended", "error", "emptied"]) {
      audio.dispatchEvent(new Event("playing"));
      expect(player.isPlaying).toBe(true);
      audio.dispatchEvent(new Event(event));
      expect(player.isPlaying).toBe(false);
    }
  });

  it("handles rejected playback", async () => {
    const audio = new Audio();
    vi.spyOn(audio, "play").mockRejectedValue(new Error("Playback blocked"));
    vi.stubGlobal(
      "Audio",
      class {
        constructor() {
          return audio;
        }
      },
    );
    const player = new UrlRecordVoicePlayer("recording.mp3");
    audio.dispatchEvent(new Event("playing"));

    player.play();
    await Promise.resolve();
    expect(player.isPlaying).toBe(false);
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
    const player = new BrowserWebSpeechApiPlayer(
      "สีเขียว",
      SpeakLanguageEnum.Thai,
    );
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
    const player = new BrowserWebSpeechApiPlayer(
      "สีเขียว",
      SpeakLanguageEnum.Thai,
    );
    await player.play();
    expect(player.isPlaying).toBe(false);
    await player.play();
    expect(player.isPlaying).toBe(false);
  });
});

describe("Google TTS playback", () => {
  it("preserves audio caching and queued preloading", () => {
    const audio = new Audio();
    const createAudio = vi.fn(function () {
      return audio;
    });
    vi.stubGlobal("Audio", createAudio);
    const queue = vi
      .spyOn(voicePlayerCallbackQueue, "add")
      .mockImplementation((load) => load());
    const play = vi.spyOn(audio, "play").mockResolvedValue(undefined);

    const first = new GoogleTtsVoicePlayer("en-US", "Fierce");
    const cached = new GoogleTtsVoicePlayer("en-US", "Fierce");

    expect(createAudio).toHaveBeenCalledExactlyOnceWith(
      "https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=Fierce",
    );
    expect(audio.preload).toBe("none");
    expect(queue).toHaveBeenCalledOnce();
    expect(audio.load).toHaveBeenCalledOnce();
    cached.play();
    expect(play).toHaveBeenCalledOnce();
    audio.dispatchEvent(new Event("playing"));
    expect(first.isPlaying).toBe(true);
    expect(cached.isPlaying).toBe(true);
    audio.dispatchEvent(new Event("ended"));
    expect(first.isPlaying).toBe(false);
    expect(cached.isPlaying).toBe(false);
  });
});
