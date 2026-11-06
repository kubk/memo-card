import { BooleanToggle } from "mobx-form-lite";
import { makeAutoObservable, reaction } from "mobx";
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
import {
  type CardSortBy,
  type CardSortDirection,
  getCardQuery,
  queryCards,
  toCardQueryParams,
} from "../../../../store/routing/card-query.ts";

export class CardListStore {
  isSortSheetOpen = new BooleanToggle(false);
  isSelectionMode = new BooleanToggle(false);
  selectedCardIds = new Set<number>();
  moveToDeckStore = new MoveToDeckSelectorStore();
  detailsQuery;
  private deckId: string;

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

  get cardQuery() {
    return getCardQuery(this.route);
  }

  get filteredCards(): DeckCardDbType[] {
    return queryCards(
      this.deck?.deckCards ?? [],
      this.cardQuery,
      (card) => card,
    );
  }

  get currentSortId() {
    return `${this.cardQuery.sortBy}-${this.cardQuery.sortDirection}`;
  }

  get isEmptySearchResults() {
    return (
      this.filteredCards.length === 0 && !!this.cardQuery.searchText.trim()
    );
  }

  setSortByIdAndDirection(
    sortBy: CardSortBy,
    sortDirection: CardSortDirection,
  ) {
    screenStore.replace({
      ...this.route,
      ...toCardQueryParams({ ...this.cardQuery, sortBy, sortDirection }),
    });
  }

  updateSearchText(searchText: string) {
    screenStore.replace({
      ...this.route,
      ...toCardQueryParams({ ...this.cardQuery, searchText }),
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
    return toCardQueryParams(this.cardQuery);
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

  async deleteSelectedCards() {
    const confirmed = await showConfirm(t("deck_form_remove_cards_confirm"));
    if (!confirmed) return;

    appLoaderStore.enable();

    try {
      const cardIds = Array.from(this.selectedCardIds);
      const result = await api.card.delete.mutate({ ids: cardIds });
      deckListStore.applyLibraryPatch(result.library);

      this.clearSelection();
    } catch (e) {
      notifyError({ e, info: "Error deleting cards" });
    } finally {
      appLoaderStore.disable();
    }
  }
}
