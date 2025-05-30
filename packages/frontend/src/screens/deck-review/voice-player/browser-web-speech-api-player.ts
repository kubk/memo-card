import { speak, SpeakLanguageEnum } from "../../../lib/voice-playback/speak.ts";
import { VoicePlayer } from "./create-voice-player.ts";

export class BrowserWebSpeechApiPlayer implements VoicePlayer {
  constructor(
    private text: string,
    private language: SpeakLanguageEnum,
  ) {}

  play() {
    speak(this.text, this.language);
  }
}
