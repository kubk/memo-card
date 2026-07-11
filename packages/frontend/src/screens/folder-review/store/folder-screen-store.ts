import { createInitialFsrsReviewState } from "api";
import { makeAutoObservable } from "mobx";
import { api } from "../../../api/trpc-api.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import {
  type DeckCardDbTypeWithType,
  type DeckListDeck,
  type DeckListFolder,
  type DeckWithCardsWithReviewType,
  deckListStore,
} from "../../../store/deck-list-store.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { userStore } from "../../../store/user-store.ts";
import { type ReviewStore } from "../../deck-review/store/review-store.ts";

const getDeckWithNewCards = (
  deck: DeckListDeck,
): DeckWithCardsWithReviewType => ({
  ...deck,
  cardsToReview: deck.deckCards.map((card) => ({
    ...card,
    type: "new",
    ...createInitialFsrsReviewState(new Date()),
  })),
});

export class FolderScreenStore {
  detailsQuery;

  constructor(private folderId: number) {
    this.detailsQuery = makeQuery({
      key: `folder.details:${folderId}`,
      query: async () => {
        const { folder } = await api.folder.folderWithDecksCards.query({
          folderId,
        });
        return folder;
      },
    });
    makeAutoObservable<this, "folderId">(
      this,
      { folderId: false },
      { autoBind: true },
    );
  }

  get ownedFolder(): DeckListFolder | null {
    const folder = deckListStore.myFoldersAsDecks.find(
      (item) => item.id === this.folderId,
    );
    return folder?.type === "folder" ? folder : null;
  }

  get previewFolder() {
    const folder = screenStore.screen.state?.folder;
    return folder?.id === this.folderId ? folder : null;
  }

  get folder(): DeckListFolder | null {
    if (this.ownedFolder) {
      return this.ownedFolder;
    }

    const folder = this.detailsQuery.data ?? this.previewFolder;
    if (!folder) {
      return null;
    }

    const decks =
      "decks" in folder ? folder.decks.map(getDeckWithNewCards) : [];

    return {
      type: "folder",
      id: folder.id,
      name: folder.title,
      description: folder.description,
      authorId: folder.authorId,
      shareId: folder.shareId,
      isPublic: folder.isPublic,
      decks,
      cardsToReview: decks.reduce<DeckCardDbTypeWithType[]>(
        (cards, deck) => cards.concat(deck.cardsToReview),
        [],
      ),
    };
  }

  get isInitialLoading() {
    if (this.ownedFolder) {
      return false;
    }

    return this.detailsQuery.isPending;
  }

  get canEdit() {
    return !!this.ownedFolder && this.folder?.authorId === userStore.myId;
  }

  get isReviewVisible() {
    return (this.folder?.cardsToReview.length ?? 0) > 0;
  }

  startReview(reviewStore: ReviewStore) {
    const folder = this.folder;
    if (!folder) {
      return;
    }

    if (!this.ownedFolder) {
      deckListStore.addFolderToMine(folder.id);
    }

    reviewStore.startFolderReview(folder.decks);
  }
}
