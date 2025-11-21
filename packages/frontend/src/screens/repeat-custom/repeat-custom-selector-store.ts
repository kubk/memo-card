import { CardReviewType } from "api";
import { makeAutoObservable } from "mobx";
import {
  DeckCardDbTypeWithType,
  DeckListItem,
  deckListStore,
  DeckWithCardsWithReviewType,
} from "../../store/deck-list-store.ts";
import { makePersistable, stopPersisting } from "mobx-persist-store";
import { getStorageAdapter } from "../../lib/platform/storage-adapter.ts";
import { TextField } from "mobx-form-lite";
import { persistableField } from "../../lib/mobx-form-lite-persistable/persistable-field.ts";
import { platform } from "../../lib/platform/platform.ts";

export type SortingType = "review-first" | "random";

type RepeatCustomForm = {
  reviewTypes: CardReviewType[];
  selectedDecksIds: number[];
};

export class RepeatCustomSelectorStore {
  form: RepeatCustomForm = {
    reviewTypes: ["new", "repeat"],
    selectedDecksIds: [],
  };

  sortingType = persistableField(
    new TextField<SortingType>("random"),
    "sortingType",
  );

  constructor() {
    makeAutoObservable(
      this,
      {
        isListRootItemOn: false,
      },
      { autoBind: true },
    );

    makePersistable(this, {
      name: "repeatCustomFormV1",
      properties: ["form"],
      storage: getStorageAdapter(),
    });
  }

  toggleCardType(type: CardReviewType) {
    if (this.form.reviewTypes.includes(type)) {
      const index = this.form.reviewTypes.indexOf(type);
      if (index !== -1) {
        this.form.reviewTypes.splice(index, 1);
      }

      if (type === "new" && this.sortingType.value === "review-first") {
        this.sortingType.value = "review-first";
      }
    } else {
      this.form.reviewTypes.push(type);
    }
  }

  toggleListRoot(deckListItem: DeckListItem) {
    if (deckListItem.type === "deck") {
      this.toggleDeckId(deckListItem.id);
    } else if (deckListItem.type === "folder") {
      // if we're trying to toggle folder, we should toggle all decks inside it
      const ids = deckListItem.decks.map((deck) => deck.id);
      const isFolderOn = ids.every((id) =>
        this.form.selectedDecksIds.includes(id),
      );
      if (isFolderOn) {
        // Remove all deck ids from the folder
        for (let i = this.form.selectedDecksIds.length - 1; i >= 0; i--) {
          if (ids.includes(this.form.selectedDecksIds[i])) {
            this.form.selectedDecksIds.splice(i, 1);
          }
        }
      } else {
        // Add missing deck ids from the folder
        for (const id of ids) {
          if (!this.form.selectedDecksIds.includes(id)) {
            this.form.selectedDecksIds.push(id);
          }
        }
      }
    }
  }

  toggleDeckId(deckId: number) {
    if (this.form.selectedDecksIds.includes(deckId)) {
      const index = this.form.selectedDecksIds.indexOf(deckId);
      if (index !== -1) {
        this.form.selectedDecksIds.splice(index, 1);
      }
    } else {
      this.form.selectedDecksIds.push(deckId);
    }
  }

  isListRootItemOn(deckListItem: DeckListItem) {
    if (deckListItem.type === "deck") {
      return this.form.selectedDecksIds.includes(deckListItem.id);
    } else if (deckListItem.type === "folder") {
      return deckListItem.decks.every((deck) =>
        this.form.selectedDecksIds.includes(deck.id),
      );
    }
    return false;
  }

  get customCardsToReview() {
    const result: Array<[DeckCardDbTypeWithType, DeckWithCardsWithReviewType]> =
      [];

    deckListStore.myDecks.forEach((deck) => {
      if (!this.form.selectedDecksIds.includes(deck.id)) {
        return;
      }

      deck.cardsToReview.forEach((card) => {
        if (this.form.reviewTypes.includes(card.type)) {
          result.push([card, deck]);
        }
      });
    });

    // Apply sorting based on the selected sorting type
    if (this.sortingType.value === "review-first") {
      // Sort by type: "repeat" cards first, then "new" cards
      result.sort((a, b) => {
        if (a[0].type === "repeat" && b[0].type === "new") return -1;
        if (a[0].type === "new" && b[0].type === "repeat") return 1;
        return 0;
      });
    } else if (this.sortingType.value === "random") {
      // Shuffle the array
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
    }

    return result;
  }

  get customCardsToReviewCount() {
    return this.customCardsToReview.length;
  }

  get isReviewButtonVisible() {
    return this.customCardsToReviewCount > 0;
  }

  private getAllDeckIds() {
    const deckIds: number[] = [];

    deckListStore.myDeckItems.forEach((item) => {
      if (item.type === "deck") {
        deckIds.push(item.id);
      } else {
        item.decks.forEach((deck) => deckIds.push(deck.id));
      }
    });

    return deckIds;
  }

  get areAllDecksSelected() {
    const allIds = this.getAllDeckIds();
    return (
      allIds.length > 0 &&
      allIds.every((id) => this.form.selectedDecksIds.includes(id))
    );
  }

  toggleSelectAllDecks() {
    if (this.areAllDecksSelected) {
      this.form.selectedDecksIds = [];
    } else {
      this.form.selectedDecksIds = this.getAllDeckIds();
    }
  }

  toggleSortingType() {
    this.sortingType.onChange(
      this.sortingType.value === "random" ? "review-first" : "random",
    );
    platform.haptic("selection");
  }

  dispose() {
    stopPersisting(this);
  }
}
