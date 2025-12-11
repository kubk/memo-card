import { makeAutoObservable, runInAction } from "mobx";
import {
  DeckListItem,
  deckListStore,
} from "../../../../store/deck-list-store.ts";
import { api } from "../../../../api/trpc-api.ts";
import {
  notifyError,
  notifySuccess,
} from "../../../shared/snackbar/snackbar.tsx";
import { BooleanToggle } from "mobx-form-lite";
import { userStore } from "../../../../store/user-store.ts";
import { cn } from "../../../../ui/cn.ts";
import { screenStore } from "../../../../store/screen-store.ts";
import { t } from "../../../../translations/t.ts";

type MoveToDeckForm = {
  sourceDeckId: number;
  targetDeckId: number | null;
  selectedCardIds: number[];
};

type OnMoveSuccessCallback = () => void;

const notifyPosition = { vertical: "top", horizontal: "center" } as const;

export class MoveToDeckSelectorStore {
  form: MoveToDeckForm | null = null;
  private onMoveSuccess: OnMoveSuccessCallback | null = null;
  isMoving = new BooleanToggle(false);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  open(
    sourceDeckId: number,
    selectedCardIds: number[],
    onMoveSuccess: OnMoveSuccessCallback,
  ) {
    this.form = {
      sourceDeckId,
      targetDeckId: null,
      selectedCardIds,
    };
    this.onMoveSuccess = onMoveSuccess;
  }

  close() {
    this.form = null;
    this.onMoveSuccess = null;
  }

  selectDeck(deckId: number) {
    if (this.form && deckId !== this.form.sourceDeckId) {
      this.form.targetDeckId = deckId;
    }
  }

  async submit() {
    const targetDeckId = this.targetDeckId;
    const cardIds = this.form?.selectedCardIds;
    if (!targetDeckId || !cardIds || cardIds.length === 0) return;

    try {
      this.isMoving.setTrue();
      const result = await api.card.moveToOtherDeck.mutate({
        cardIds,
        targetDeckId,
      });

      runInAction(() => {
        deckListStore.replaceDeck(result.sourceDeck, true);
        deckListStore.replaceDeck(result.targetDeck, true);
        deckListStore.updateCardsToReview(result.cardsToReview);

        this.onMoveSuccess?.();
        this.close();
      });

      notifySuccess(
        <div className="flex flex-col gap-2">
          <div className={cn("font-medium")}>{t("move_card_success")}</div>
          <div>
            {t("move_card_open_deck")}{" "}
            <span
              className="underline"
              onClick={() => {
                screenStore.goToDeckForm({ deckId: targetDeckId });
              }}
            >
              {result.targetDeck.name}
            </span>
          </div>
        </div>,
        {
          duration: 4000,
        },
      );
    } catch (e: unknown) {
      notifyError(
        // DO not translate - debug string
        { e, info: "Error moving cards" },
        { anchorOrigin: notifyPosition },
      );
    } finally {
      this.isMoving.setFalse();
    }
  }

  get isOpen() {
    return this.form !== null;
  }

  get targetDeckId() {
    return this.form?.targetDeckId ?? null;
  }

  get canConfirm() {
    return this.form?.targetDeckId !== null;
  }

  get availableDecksGrouped(): DeckListItem[] {
    const myDeckIds = deckListStore.deckIdsOwnedByMe();
    const sourceDeckId = this.form?.sourceDeckId;
    const result: DeckListItem[] = [];

    for (const item of deckListStore.myDeckItems) {
      if (item.type === "deck") {
        if (item.id === sourceDeckId || !myDeckIds.includes(item.id)) {
          continue;
        }
        result.push(item);
      } else {
        if (item.authorId !== userStore.myId) {
          continue;
        }
        const decks = item.decks.filter(
          (deck) => deck.id !== sourceDeckId && myDeckIds.includes(deck.id),
        );
        if (decks.length === 0) {
          continue;
        }
        result.push({ ...item, decks });
      }
    }

    return result;
  }

  isDeckSelected(deckId: number) {
    return this.form?.targetDeckId === deckId;
  }

  get targetDeckName(): string | null {
    if (!this.form?.targetDeckId) return null;

    for (const item of deckListStore.myDeckItems) {
      if (item.type === "deck" && item.id === this.form.targetDeckId) {
        return item.name;
      }
      if (item.type === "folder") {
        const deck = item.decks.find((d) => d.id === this.form?.targetDeckId);
        if (deck) return deck.name;
      }
    }
    return null;
  }
}
