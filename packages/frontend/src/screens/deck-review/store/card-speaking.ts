import { userStore } from "../../../store/user-store.ts";
import { type DeckWithCardsDbType } from "api";
import { type VoicePlayer } from "../voice-player/create-voice-player.ts";

type SpeakingCard = {
  voicePlayer?: VoicePlayer;
  isOpened: boolean;
  deckSpeakField: DeckWithCardsDbType["speakField"];
};

export function speakCard(
  voicePlayer?: VoicePlayer,
  isEnabled = userStore.isSpeakingCardsEnabled,
) {
  if (!isEnabled) {
    return;
  }

  voicePlayer?.play();
}

// Question audio plays when the card is shown, answer audio when it is opened
export function speakCardOnShow(
  card: SpeakingCard,
  isEnabled = userStore.isSpeakingCardsEnabled,
) {
  if (card.deckSpeakField === "front") {
    speakCard(card.voicePlayer, isEnabled);
  }
}

export function speakCardOnOpen(
  card: SpeakingCard,
  isEnabled = userStore.isSpeakingCardsEnabled,
) {
  if (card.deckSpeakField !== "front") {
    speakCard(card.voicePlayer, isEnabled);
  }
}

export function isCardSpeakerVisible(
  card: SpeakingCard,
  side: "front" | "back",
  isEnabled = userStore.isSpeakingCardsEnabled,
) {
  if (!isEnabled || !card.voicePlayer) {
    return false;
  }

  return side === card.deckSpeakField && (card.isOpened || side === "front");
}
