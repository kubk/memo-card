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
import { featuresStore } from "../../../store/features-store.ts";

export interface VoicePlayer {
  play(): void;
}

export const createVoicePlayer = (
  card: {
    voice?: string | null;
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

  if (!deckForm.speakingCardsLocale || !deckForm.speakingCardsField) {
    return null;
  }

  const text = removeAllTags(card[deckForm.speakingCardsField]);

  if (featuresStore.isFeatureEnabled("googleTts")) {
    return new GoogleTtsVoicePlayer(deckForm.speakingCardsLocale, text);
  }

  if (isSpeechSynthesisSupported) {
    if (!isEnumValid(deckForm.speakingCardsLocale, SpeakLanguageEnum)) {
      return null;
    }
    return new BrowserWebSpeechApiPlayer(text, deckForm.speakingCardsLocale);
  }

  return new GoogleTtsVoicePlayer(deckForm.speakingCardsLocale, text);
};
