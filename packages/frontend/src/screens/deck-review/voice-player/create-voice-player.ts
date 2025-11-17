import { DeckSpeakFieldEnum } from "api";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import {
  isSpeechSynthesisSupported,
  SpeakLanguageEnum,
} from "../../../lib/voice-playback/speak.ts";
import { isEnumValid } from "../../../lib/typescript/is-enum-valid.ts";
import { BrowserWebSpeechApiPlayer } from "./browser-web-speech-api-player.ts";
import { UrlRecordVoicePlayer } from "./url-record-voice-player.ts";
import { GoogleTtsVoicePlayer } from "./google-tts-voice-player.ts";

export interface VoicePlayer {
  play(): void;
}

export const createVoicePlayer = (
  card: {
    voice?: string | null;
    speakField?: DeckSpeakFieldEnum | null;
    front: string;
    back: string;
  },
  deckForm: {
    speakingCardsLocale: string | null;
    speakingCardsField: DeckSpeakFieldEnum | null;
  },
): VoicePlayer | null => {
  if (card.voice) {
    return new UrlRecordVoicePlayer(card.voice);
  }

  // Use card-level speakField override if provided, otherwise use deck default
  const effectiveSpeakField = card.speakField || deckForm.speakingCardsField;

  if (!deckForm.speakingCardsLocale || !effectiveSpeakField) {
    return null;
  }

  const text = removeAllTags(card[effectiveSpeakField]);

  if (isSpeechSynthesisSupported) {
    if (!isEnumValid(deckForm.speakingCardsLocale, SpeakLanguageEnum)) {
      return null;
    }
    return new BrowserWebSpeechApiPlayer(text, deckForm.speakingCardsLocale);
  }

  return new GoogleTtsVoicePlayer(deckForm.speakingCardsLocale, text);
};
