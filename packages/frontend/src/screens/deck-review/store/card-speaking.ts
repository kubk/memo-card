import { userStore } from "../../../store/user-store.ts";
import { type DeckWithCardsDbType } from "api";
import { type VoicePlayer } from "../voice-player/create-voice-player.ts";

export function speakCard(voicePlayer?: VoicePlayer) {
  if (!userStore.isSpeakingCardsEnabled) {
    return;
  }

  voicePlayer?.play();
}

export function isCardSpeakerVisible(
  card: {
    voicePlayer?: VoicePlayer;
    isOpened: boolean;
    deckSpeakField: DeckWithCardsDbType["speakField"];
  },
  side: "front" | "back",
) {
  if (!userStore.isSpeakingCardsEnabled || !card.voicePlayer) {
    return false;
  }

  return card.isOpened && side === card.deckSpeakField;
}
