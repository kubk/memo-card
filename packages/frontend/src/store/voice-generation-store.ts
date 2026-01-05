import { makeAutoObservable, runInAction } from "mobx";
import { DeckCardDbType, DeckWithCardsDbType } from "api";
import { generateVoiceForNewCards } from "../lib/voice/generate-voice-for-new-cards.ts";
import { userStore } from "./user-store.ts";
import { deckListStore } from "./deck-list-store.ts";

class VoiceGenerationStore {
  generatingCardIds = new Set<number>();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  isGenerating(cardId: number): boolean {
    return this.generatingCardIds.has(cardId);
  }

  generateForCard(deck: DeckWithCardsDbType, card: DeckCardDbType) {
    this.generateForCards(deck, [card]);
  }

  generateForCards(deck: DeckWithCardsDbType, cards: DeckCardDbType[]) {
    if (!deck.speakAutoAi || !deck.speakField || !deck.speakLocale) {
      return;
    }
    if (!userStore.isPaid) {
      return;
    }

    const cardsNeedingVoice = cards.filter((card) => !card.options?.voice);
    if (cardsNeedingVoice.length === 0) {
      return;
    }

    cardsNeedingVoice.forEach((card) => {
      this.generatingCardIds.add(card.id);
    });

    generateVoiceForNewCards({
      deckId: deck.id,
      cards: cardsNeedingVoice,
      onVoiceGenerated: (cardId) => {
        runInAction(() => {
          this.generatingCardIds.delete(cardId);
        });
      },
    }).catch(() => {
      runInAction(() => {
        cardsNeedingVoice.forEach((card) => {
          this.generatingCardIds.delete(card.id);
        });
      });
    });
  }

  generateForDeckCards(deckId: number, cards: DeckCardDbType[]) {
    const deck = deckListStore.searchDeckById(deckId);
    if (!deck) return;
    this.generateForCards(deck, cards);
  }
}

export const voiceGenerationStore = new VoiceGenerationStore();
