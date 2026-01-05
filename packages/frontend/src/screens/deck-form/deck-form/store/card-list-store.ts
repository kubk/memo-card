import { BooleanToggle } from "mobx-form-lite";
import { DeckFormStore } from "./deck-form-store";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { platform } from "../../../../lib/platform/platform.ts";
import { showConfirm } from "../../../../lib/platform/show-confirm";
import { deckListStore } from "../../../../store/deck-list-store";
import { appLoaderStore } from "../../../../store/app-loader-store";
import { t } from "../../../../translations/t";
import { MoveToDeckSelectorStore } from "./move-to-deck-selector-store";
import { api } from "../../../../api/trpc-api";
import { notifyError } from "../../../shared/snackbar/snackbar";

export class CardListStore {
  isSortSheetOpen = new BooleanToggle(false);
  isSelectionMode = new BooleanToggle(false);
  selectedCardIds = new Set<number>();
  moveToDeckStore = new MoveToDeckSelectorStore();

  constructor(private deckFormStore: DeckFormStore) {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.isSelectionMode.value,
      () => platform.haptic("medium"),
    );
  }

  openMoveSheet() {
    const deckId = this.deckFormStore.deckForm?.id;
    if (deckId) {
      this.moveToDeckStore.open(
        deckId,
        Array.from(this.selectedCardIds),
        () => {
          this.deckFormStore.loadForm();
          this.clearSelection();
        },
      );
    }
  }

  toggleCardSelection(cardId: number) {
    if (this.selectedCardIds.has(cardId)) {
      this.selectedCardIds.delete(cardId);
    } else {
      this.selectedCardIds.add(cardId);
    }
  }

  clearSelection() {
    this.selectedCardIds.clear();
    this.isSelectionMode.setFalse();
  }

  get areAllCardsSelected() {
    const validCardIds = this.deckFormStore.filteredCards
      .map((c) => c.id)
      .filter((id): id is number => id !== undefined);
    return (
      validCardIds.length > 0 &&
      validCardIds.every((id) => this.selectedCardIds.has(id))
    );
  }

  toggleSelectAll() {
    if (this.areAllCardsSelected) {
      this.clearSelection();
    } else {
      this.isSelectionMode.setTrue();
      const validCardIds = this.deckFormStore.filteredCards
        .map((c) => c.id)
        .filter((id): id is number => id !== undefined);
      validCardIds.forEach((id) => this.selectedCardIds.add(id));
    }
  }

  async deleteSelectedCards() {
    const confirmed = await showConfirm(t("deck_form_remove_cards_confirm"));
    if (!confirmed) return;

    appLoaderStore.enable();

    try {
      const cardIds = Array.from(this.selectedCardIds);
      const result = await api.card.deleteMany.mutate({ ids: cardIds });

      const { deck, cardsToReview } = result;
      runInAction(() => {
        deckListStore.replaceDeck(deck, true);
        deckListStore.updateCardsToReview(cardsToReview);
        this.deckFormStore.loadForm();
      });

      this.clearSelection();
    } catch (e) {
      notifyError({ e, info: "Error deleting cards" });
    } finally {
      appLoaderStore.disable();
    }
  }
}
