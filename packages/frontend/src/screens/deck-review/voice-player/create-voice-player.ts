import {
  applyDeckVariables,
  isSpeakLanguage,
  type DeckWithCardsDbType,
} from "api";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";
import { isSpeechSynthesisSupported } from "../../../lib/voice-playback/speech-synthesis.ts";
import { BrowserWebSpeechApiPlayer } from "./browser-web-speech-api-player.ts";
import { UrlRecordVoicePlayer } from "./url-record-voice-player.ts";
import { createGoogleTtsVoicePlayer } from "./google-tts-voice-player.ts";

export type VoicePlayer = {
  isPlaying: boolean;
  play(): void;
  preload(): void;
};

export const createVoicePlayer = (
  card: {
    voice?: string | null;
    speakField?: DeckWithCardsDbType["speakField"];
    front: string;
    back: string;
  },
  deckForm: {
    speakingCardsLocale: string | null;
    speakingCardsField: DeckWithCardsDbType["speakField"];
  },
): VoicePlayer | null => {
  if (card.voice) {
    return new UrlRecordVoicePlayer(card.voice);
  }

  // A card-level setting takes precedence over the deck-wide default.
  const effectiveSpeakField = card.speakField || deckForm.speakingCardsField;

  if (!deckForm.speakingCardsLocale || !effectiveSpeakField) {
    return null;
  }

  const text = removeAllTags({
    text: applyDeckVariables(
      card[effectiveSpeakField],
      deckListStore.deckVariables,
    ),
    fallback: false,
  });

  if (isSpeechSynthesisSupported) {
    if (!isSpeakLanguage(deckForm.speakingCardsLocale)) {
      return null;
    }
    return new BrowserWebSpeechApiPlayer(text, deckForm.speakingCardsLocale);
  }

  return createGoogleTtsVoicePlayer(deckForm.speakingCardsLocale, text);
};
