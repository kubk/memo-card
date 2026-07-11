import { action, makeAutoObservable } from "mobx";
import { DeckCardDbType, RouterOutput } from "api";
import { generateVoiceForNewCards } from "../lib/voice/generate-voice-for-new-cards.ts";
import { userStore } from "./user-store.ts";
import { deckListStore } from "./deck-list-store.ts";

type MyDeck = RouterOutput["me"]["info"]["myDecks"][number];

class VoiceGenerationStore {
  generatingCardIds = new Set<number>();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  generateForCard(deck: MyDeck, card: DeckCardDbType) {
    this.generateForCards(deck, [card]);
  }

  generateForCards(deck: MyDeck, cards: DeckCardDbType[]) {
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
      onVoiceGenerated: action((cardId) => {
        this.generatingCardIds.delete(cardId);
      }),
    }).catch(
      action(() => {
        cardsNeedingVoice.forEach((card) => {
          this.generatingCardIds.delete(card.id);
        });
      }),
    );
  }

  generateForDeckCards(deckId: number, cards: DeckCardDbType[]) {
    const deck = deckListStore.searchDeckById(deckId);
    if (!deck) return;
    this.generateForCards(deck, cards);
  }
}

export const voiceGenerationStore = new VoiceGenerationStore();
