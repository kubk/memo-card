import { BooleanToggle } from "mobx-form-lite";
import { DeckFormStore } from "./deck-form-store";
import { makeAutoObservable, runInAction } from "mobx";
import { showConfirm } from "../../../../lib/platform/show-confirm";
import { deckListStore } from "../../../../store/deck-list-store";
import { assert } from "api";
import { t } from "../../../../translations/t";
import { MoveToDeckSelectorStore } from "./move-to-deck-selector-store";

export class CardListStore {
  isSortSheetOpen = new BooleanToggle(false);
  isSelectionMode = new BooleanToggle(false);
  selectedCardIds = new Set<number>();
  moveToDeckStore = new MoveToDeckSelectorStore();

  constructor(private deckFormStore: DeckFormStore) {
    makeAutoObservable(this, {}, { autoBind: true });
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
    const result = await showConfirm(t("deck_form_remove_cards_confirm"));
    if (!result) return;

    runInAction(() => {
      deckListStore.isAppLoading = true;
      assert(this.deckFormStore.deckForm, "deleteSelectedCards: form is empty");
      this.deckFormStore.deckForm.cardsToRemoveIds.push(
        ...this.selectedCardIds,
      );
    });

    try {
      await this.deckFormStore.onDeckSave();

      this.clearSelection();
    } finally {
      runInAction(() => {
        deckListStore.isAppLoading = false;
      });
    }
  }
}
