import { BooleanToggle } from "mobx-form-lite";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { platform } from "../../../../lib/platform/platform.ts";
import { showConfirm } from "../../../../lib/platform/show-confirm";
import { deckListStore } from "../../../../store/deck-list-store";
import { appLoaderStore } from "../../../../store/app-loader-store";
import { t } from "../../../../translations/t";
import { MoveToDeckSelectorStore } from "./move-to-deck-selector-store";
import { api } from "../../../../api/trpc-api";
import { notifyError } from "../../../shared/snackbar/snackbar";
import { screenStore } from "../../../../store/screen-store.ts";
import { assert, type DeckCardDbType } from "api";
import { deckDetailsStore } from "../../../../store/deck-details-store.ts";
import { translateCreateReverseConfirm } from "../translate-create-reverse-confirm.ts";

export type CardFilterSortBy = "createdAt" | "frontAlpha" | "backAlpha";
export type CardFilterDirection = "desc" | "asc";

export class CardListStore {
  isSortSheetOpen = new BooleanToggle(false);
  isSelectionMode = new BooleanToggle(false);
  selectedCardIds = new Set<number>();
  moveToDeckStore = new MoveToDeckSelectorStore();
  detailsQuery;
  private deckId: number;

  constructor() {
    const route = screenStore.screen;
    assert(
      route.type === "cardList" || route.type === "cardListPreview",
      "CardListStore requires a card list route",
    );
    this.deckId = route.deckId;
    this.detailsQuery = deckDetailsStore.getQuery(route.deckId);
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.isSelectionMode.value,
      () => platform.haptic("medium"),
    );
  }

  get deck() {
    return this.detailsQuery.data ?? null;
  }

  get canEdit() {
    return !!this.deck && deckListStore.isDeckOwner(this.deck);
  }

  get isReadOnly() {
    return !this.canEdit;
  }

  private get route() {
    const route = screenStore.screen;
    assert(
      route.type === "cardList" || route.type === "cardListPreview",
      "CardListStore requires a card list route",
    );
    return route;
  }

  get cardFilterSortBy(): CardFilterSortBy {
    return this.route.sortBy ?? "createdAt";
  }

  get cardFilterSortDirection(): CardFilterDirection {
    return this.route.sortDirection ?? "desc";
  }

  get cardFilterText() {
    return this.route.searchText ?? "";
  }

  get filteredCards(): DeckCardDbType[] {
    const cards = this.deck?.deckCards ?? [];
    const textFilter = this.cardFilterText.trim().toLowerCase();

    return cards
      .filter((card) => {
        if (!textFilter) {
          return true;
        }
        return (
          card.front.toLowerCase().includes(textFilter) ||
          card.back.toLowerCase().includes(textFilter)
        );
      })
      .slice()
      .sort((a, b) => {
        if (this.cardFilterSortBy === "frontAlpha") {
          return this.cardFilterSortDirection === "desc"
            ? b.front.toLowerCase().localeCompare(a.front.toLowerCase())
            : a.front.toLowerCase().localeCompare(b.front.toLowerCase());
        }
        if (this.cardFilterSortBy === "backAlpha") {
          return this.cardFilterSortDirection === "desc"
            ? b.back.toLowerCase().localeCompare(a.back.toLowerCase())
            : a.back.toLowerCase().localeCompare(b.back.toLowerCase());
        }
        if (this.cardFilterSortBy === "createdAt") {
          return this.cardFilterSortDirection === "desc"
            ? b.createdAt.localeCompare(a.createdAt)
            : a.createdAt.localeCompare(b.createdAt);
        }

        return this.cardFilterSortBy satisfies never;
      });
  }

  get currentSortId() {
    return `${this.cardFilterSortBy}-${this.cardFilterSortDirection}`;
  }

  get isEmptySearchResults() {
    return this.filteredCards.length === 0 && !!this.cardFilterText.trim();
  }

  setSortByIdAndDirection(
    sortBy: CardFilterSortBy,
    sortDirection: CardFilterDirection,
  ) {
    screenStore.replace({
      ...this.route,
      sortBy,
      sortDirection,
      searchText: this.cardFilterText || undefined,
    });
  }

  updateSearchText(searchText: string) {
    screenStore.replace({
      ...this.route,
      sortBy: this.cardFilterSortBy,
      sortDirection: this.cardFilterSortDirection,
      searchText: searchText || undefined,
    });
  }

  openCard(cardId: number) {
    if (this.canEdit && this.isSelectionMode.value) {
      platform.haptic("selection");
      this.toggleCardSelection(cardId);
      return;
    }

    if (this.canEdit) {
      screenStore.push({
        type: "deckForm",
        deckId: this.deckId,
        cardId,
        ...this.getFilterParams(),
      });
      return;
    }

    screenStore.push({
      type: "cardPreviewId",
      cardId,
      deckId: this.deckId,
    });
  }

  navigateToNewCard() {
    if (!this.canEdit) {
      return;
    }

    screenStore.push({
      type: "deckForm",
      deckId: this.deckId,
      cardId: "new",
      ...this.getFilterParams(),
    });
  }

  private getFilterParams() {
    return {
      sortBy: this.cardFilterSortBy,
      sortDirection: this.cardFilterSortDirection,
      searchText: this.cardFilterText || undefined,
    };
  }

  openMoveSheet() {
    this.moveToDeckStore.open(
      this.deckId,
      Array.from(this.selectedCardIds),
      this.clearSelection,
    );
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
    const validCardIds = this.filteredCards.map((card) => card.id);
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
      const validCardIds = this.filteredCards.map((card) => card.id);
      validCardIds.forEach((id) => this.selectedCardIds.add(id));
    }
  }

  async createReverseCards() {
    const confirmed = await showConfirm(
      translateCreateReverseConfirm(this.selectedCardIds.size),
    );
    if (!confirmed) return;

    appLoaderStore.enable();
    try {
      const result = await api.card.createMissingReverse.mutate({
        cardIds: Array.from(this.selectedCardIds),
      });

      const { deck, cardsToReview } = result;
      runInAction(() => {
        deckListStore.replaceDeck(deck, true);
        deckListStore.updateCardsToReview(cardsToReview);
      });
      this.clearSelection();
    } catch (e) {
      notifyError({ e, info: "Error creating reverse cards" });
    } finally {
      appLoaderStore.disable();
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
      });

      this.clearSelection();
    } catch (e) {
      notifyError({ e, info: "Error deleting cards" });
    } finally {
      appLoaderStore.disable();
    }
  }
}
