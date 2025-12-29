import { runInAction } from "mobx";
import { api } from "../../api/trpc-api.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { DeckCardDbType } from "api";
import { userStore } from "../../store/user-store.ts";

type GenerateVoiceInput = {
  deckId: number;
  cards: DeckCardDbType[];
  onVoiceGenerated?: (cardId: number, voiceUrl: string) => void;
};

/**
 * Generates AI voice for cards that need it based on deck settings.
 * This function checks if the deck has speakAutoAi enabled and generates
 * voice for cards that don't have one yet.
 */
export const generateVoiceForNewCards = async (
  input: GenerateVoiceInput,
): Promise<void> => {
  const { deckId, cards, onVoiceGenerated } = input;

  const deck = deckListStore.searchDeckById(deckId);
  if (!deck) return;

  // Check if auto AI voice is enabled
  if (!deck.speakAutoAi || !deck.speakField || !deck.speakLocale) return;

  if (!userStore.isPaid) return;

  const speakField = deck.speakField;
  const speakLocale = deck.speakLocale;

  // Filter cards that need voice generation
  const cardsNeedingVoice = cards
    .filter((card) => card.id && !card.options?.voice)
    .map((card) => ({
      id: card.id,
      text: card[speakField],
    }))
    .filter((card) => card.text);

  if (cardsNeedingVoice.length === 0) return;

  // Generate voice for each card
  for (const card of cardsNeedingVoice) {
    try {
      const result = await api.aiSpeechGenerate.mutate({
        text: card.text,
        language: speakLocale,
        cardId: card.id,
      });

      if (!result.data?.publicUrl) continue;

      const voiceUrl = result.data.publicUrl;

      runInAction(() => {
        // Update deck in store
        const deckInStore = deckListStore.myDecks.find((d) => d.id === deckId);
        const deckCard = deckInStore?.deckCards.find((c) => c.id === card.id);
        if (deckCard) {
          deckCard.options = { ...deckCard.options, voice: voiceUrl };
        }

        // Call optional callback for additional updates (e.g., form state)
        onVoiceGenerated?.(card.id, voiceUrl);
      });
    } catch (e) {
      console.error(`Failed to generate voice for card ${card.id}:`, e);
    }
  }
};
