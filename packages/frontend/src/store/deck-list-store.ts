import { action, makeAutoObservable, runInAction, when } from "mobx";
import { type MyInfoResponse } from "api";
import { type DeckCardDbType, type DeckWithCardsDbType } from "api";
import { screenStore } from "./screen-store.ts";
import { CardReviewType, type CardToReviewDbType } from "api";
import { ReviewStore } from "../screens/deck-review/store/review-store.ts";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";
import { BooleanToggle } from "mobx-form-lite";
import { userStore } from "./user-store.ts";
import { showConfirm } from "../lib/platform/show-confirm.ts";
import { t } from "../translations/t.ts";
import { canDuplicateDeckOrFolder } from "api";
import { hapticImpact } from "../lib/platform/telegram/haptics.ts";
import { FolderWithDecksWithCards } from "api";
import { type FolderWithDeckIdDbType } from "api";
import { CatalogFolderDbType } from "api";
import { RequestStore } from "../lib/mobx-request/request-store.ts";
import { notifyError } from "../screens/shared/snackbar/snackbar.tsx";
import { assert } from "api";
import { arrayDifference } from "../lib/array/array-difference.ts";
import { boolNarrow } from "../lib/typescript/bool-narrow.ts";
import { api } from "../api/trpc-api.ts";

export enum StartParamType {
  RepeatAll = "repeat_all",
  DeckCatalog = "catalog",
  Pro = "pro",
  Settings = "settings",
  Components = "ui_kit",
  Debug = "debug",
  Break = "break",
}

export type DeckCardDbTypeWithType = DeckCardDbType & {
  type: CardReviewType;
};

export type DeckWithCardsWithReviewType = DeckWithCardsDbType & {
  cardsToReview: DeckCardDbTypeWithType[];
};

export type DeckListItem = {
  id: number;
  cardsToReview: DeckCardDbTypeWithType[];
  name: string;
  description: string | null;
  isPublic: boolean;
} & (
  | {
      type: "deck";
    }
  | {
      type: "folder";
      decks: DeckWithCardsWithReviewType[];
      authorId: number;
      shareId: string;
    }
);

export class DeckListStore {
  myInfo?: Exclude<MyInfoResponse, "plans" | "user">;
  myInfoRequest = new RequestStore(api.me.info.query, {
    staleWhileRevalidate: true,
  });

  isAppLoading = false;
  isStartParamHandled = false;

  skeletonLoaderData = { publicCount: 3, myDecksCount: 3 };

  deckWithCardsRequest = new RequestStore(api.deck.deckWithCards.query);
  isMyDecksExpanded = new BooleanToggle(false);

  catalogFolder?: FolderWithDecksWithCards;
  getFolderWithDecksCards = new RequestStore(
    api.folder.folderWithDecksCards.query,
  );

  constructor() {
    makeAutoObservable(
      this,
      {
        searchDeckById: false,
        searchFolderById: false,
        hasFolderInMine: false,
        isDeckFolderAdded: false,
      },
      { autoBind: true },
    );
  }

  get collapsedDeckLimit() {
    return 6;
  }

  get isCatalogItemLoading() {
    return (
      this.deckWithCardsRequest.isLoading ||
      this.getFolderWithDecksCards.isLoading
    );
  }

  loadFirstTime(startParam?: string) {
    this.load();
    this.handleStartParam(startParam);
  }

  private addFolder(folder: FolderWithDecksWithCards) {
    assert(this.myInfo);
    if (
      this.myInfo.folders.find((myFolder) => myFolder.folder_id === folder.id)
    ) {
      screenStore.go({ type: "folderPreview", folderId: folder.id });
      return;
    }

    for (const deck of folder.decks) {
      // Push new folders
      this.myInfo.folders.push({
        deck_id: deck.id,
        folder_id: folder.id,
        folder_author_id: folder.authorId,
        folder_description: folder.description,
        folder_share_id: folder.shareId,
        folder_title: folder.title,
      });
      // Push new decks
      this.myInfo.myDecks.push(deck);
      // Push new cards
      this.myInfo.cardsToReview = this.myInfo.cardsToReview.concat(
        deck.deckCards.map((card) => ({
          id: card.id,
          deckId: deck.id,
          type: "new",
        })),
      );
    }
    screenStore.go({ type: "folderPreview", folderId: folder.id });
  }

  addCardOptimistic(card: DeckCardDbType) {
    const deck = this.searchDeckById(card.deckId);
    if (!deck || !this.myInfo) {
      return;
    }
    deck.deckCards.push(card);
    this.myInfo.cardsToReview.push({
      ...card,
      type: "new",
    });
  }

  async openFolderFromCatalog(folderWithoutDecks: CatalogFolderDbType) {
    assert(this.myInfo);
    if (
      this.myInfo.folders.find(
        (myFolder) => myFolder.folder_id === folderWithoutDecks.id,
      )
    ) {
      screenStore.go({
        type: "folderPreview",
        folderId: folderWithoutDecks.id,
      });
      return;
    }

    this.catalogFolder = {
      ...folderWithoutDecks,
      decks: [],
    };
    screenStore.go({ type: "folderPreview", folderId: this.catalogFolder.id });

    const result = await this.getFolderWithDecksCards.execute({
      folderId: folderWithoutDecks.id,
    });
    if (result.status === "error") {
      notifyError({
        e: result.error,
        info: `Error while retrieving folder: ${folderWithoutDecks.id}`,
      });
      return;
    }

    const { folder } = result.data;
    runInAction(() => {
      this.catalogFolder = folder;
    });
  }

  get canReview() {
    const deck = this.selectedDeck;
    if (!deck) {
      return false;
    }

    return (
      deck.cardsToReview.length > 0 || screenStore.screen.type === "deckPublic"
    );
  }

  startDeckReview(reviewStore: ReviewStore) {
    if (!this.canReview) {
      return;
    }

    assert(this.selectedDeck, "No selected deck for review");
    if (screenStore.screen.type === "deckPublic") {
      this.addDeckToMine(this.selectedDeck.id);
    }

    reviewStore.startDeckReview(this.selectedDeck);
  }

  addDeckToMine(deckId: number, silent = false) {
    return api.deck.addToMine
      .mutate({
        deckId,
      })
      .then(() => {
        if (silent) {
          return;
        }
        this.load();
      })
      .catch((error) => {
        reportHandledError("Error while adding deck to mine", error, {
          deckId,
        });
      });
  }

  addFolderToMine(folderId: number) {
    return api.folder.addToMine
      .mutate({
        folderId,
      })
      .then(
        action(() => {
          this.catalogFolder = undefined;
          this.load();
        }),
      )
      .catch((error) => {
        reportHandledError("Error while adding folder to mine", error, {
          folderId,
        });
      });
  }

  get canShareDeck() {
    const deck = this.selectedDeck;
    if (!deck) {
      return false;
    }
    return deckListStore.canEditDeck || deck.isPublic;
  }

  get canEditDeck() {
    const deck = this.selectedDeck;
    if (!deck) {
      return false;
    }
    return deck.authorId === userStore.myId || userStore.isAdmin;
  }

  async openDeckFromCatalog(deck: DeckWithCardsDbType, isMine: boolean) {
    assert(this.myInfo);
    if (isMine) {
      screenStore.go({ type: "deckMine", deckId: deck.id });
      return;
    }
    if (!this.publicDecks.find((publicDeck) => publicDeck.id === deck.id)) {
      this.myInfo.publicDecks.push(deck);
    }
    screenStore.go({ type: "deckPublic", deckId: deck.id });

    const result = await this.deckWithCardsRequest.execute({ deckId: deck.id });
    if (result.status === "error") {
      notifyError({ e: result.error, info: `Error opening deck: ${deck.id}` });
      return;
    }
    this.replaceDeck(result.data);
  }

  goDeckById(deckId: number): boolean {
    if (!this.myInfo) {
      return false;
    }
    const myDeck = this.myInfo.myDecks.find((deck) => deck.id === deckId);
    if (myDeck) {
      screenStore.go({ type: "deckMine", deckId });
      return true;
    }
    const publicDeck = this.publicDecks.find((deck) => deck.id === deckId);
    if (publicDeck) {
      screenStore.go({ type: "deckPublic", deckId });
      return true;
    }

    return false;
  }

  searchDeckById(deckId: number) {
    if (!this.myInfo) {
      return null;
    }
    const decksToSearch = this.myInfo.myDecks.concat(this.publicDecks);
    return decksToSearch.find((deck) => deck.id === deckId);
  }

  searchFolderById(folderId: number) {
    if (!this.myInfo) {
      return null;
    }
    const foldersToSearch = this.myInfo.folders;
    return foldersToSearch.find((folder) => folder.folder_id === folderId);
  }

  reviewFolder(reviewStore: ReviewStore) {
    const folder = this.selectedFolder;
    assert(folder, "Folder should be selected before review");

    if (folder.id === this.catalogFolder?.id) {
      this.addFolderToMine(folder.id);
    }

    reviewStore.startFolderReview(folder.decks);
  }

  get selectedFolder() {
    const screen = screenStore.screen;
    if (screen.type !== "folderPreview" || !this.myInfo) {
      return null;
    }

    if (this.catalogFolder?.id === screen.folderId) {
      const decksWithCardsToReview = this.catalogFolder.decks.map((deck) => ({
        ...deck,
        cardsToReview: deck.deckCards.map((card) => ({
          ...card,
          type: "new" as const,
        })),
      }));

      return {
        type: "folder" as const,
        decks: decksWithCardsToReview,
        cardsToReview: decksWithCardsToReview.reduce<DeckCardDbTypeWithType[]>(
          (acc, deck) => acc.concat(deck.cardsToReview),
          [],
        ),
        shareId: this.catalogFolder.shareId,
        authorId: this.catalogFolder.authorId,
        isPublic: this.catalogFolder.isPublic,
        name: this.catalogFolder.title,
        id: this.catalogFolder.id,
        description: this.catalogFolder.description,
      };
    }

    const folder = this.myFoldersAsDecks.find(
      (folder) => folder.id === screen.folderId,
    );

    if (!folder) {
      return null;
    }
    assert(folder.type === "folder", "folder is not folder type");

    return folder;
  }

  get canEditFolder() {
    const folder = this.selectedFolder;
    if (!folder) {
      return false;
    }
    if (!this.hasFolderInMine(folder.id)) {
      return false;
    }

    return folder.authorId === userStore.myId || userStore.isAdmin;
  }

  hasFolderInMine(folderId: number) {
    return !!this.myFoldersAsDecks.find(({ id }) => id === folderId);
  }

  get canDuplicateSelectedFolder() {
    const folder = this.selectedFolder;
    if (!folder) {
      return false;
    }
    const user = userStore.user;
    if (!user) {
      return false;
    }

    return canDuplicateDeckOrFolder(user, folder, userStore.plans);
  }

  get canDuplicateSelectedDeck() {
    const deck = this.selectedDeck;
    if (!deck) {
      return false;
    }
    const user = userStore.user;
    if (!user) {
      return false;
    }

    return canDuplicateDeckOrFolder(user, deck, userStore.plans);
  }

  get isFolderReviewVisible() {
    return this.selectedFolder
      ? this.selectedFolder.cardsToReview.length > 0
      : false;
  }

  get selectedDeck(): DeckWithCardsWithReviewType | null {
    const screen = screenStore.screen;
    const isSelectedDeckVisible =
      screen.type === "deckPublic" || screen.type === "deckMine";
    if (!isSelectedDeckVisible) {
      return null;
    }
    if (!screen.deckId || !this.myInfo) {
      return null;
    }

    const deck = this.searchDeckById(screen.deckId);
    if (!deck) {
      return null;
    }

    const cardsToReview =
      screen.type === "deckPublic"
        ? deck.deckCards.map((card) => ({ ...card, type: "new" as const }))
        : getCardsToReview(deck, this.myInfo.cardsToReview);

    return {
      ...deck,
      cardsToReview: cardsToReview,
    };
  }

  replaceDeck(deck: DeckWithCardsDbType, addToMine = false) {
    if (!this.myInfo) {
      return;
    }
    const deckMineIndex = this.myInfo.myDecks.findIndex(
      (myDeck) => myDeck.id === deck.id,
    );
    if (deckMineIndex !== -1) {
      this.myInfo.myDecks[deckMineIndex] = deck;
      return;
    }

    const deckPublicIndex = this.myInfo.publicDecks.findIndex(
      (publicDeck) => publicDeck.id === deck.id,
    );
    if (deckPublicIndex !== -1) {
      this.myInfo.publicDecks[deckPublicIndex] = deck;
      return;
    }

    if (addToMine) {
      this.myInfo.myDecks.push(deck);
    }
  }

  updateDeckCardInputMode(deckId: number, cardInputModeId: string | null) {
    const deck = this.searchDeckById(deckId);
    if (!deck) {
      return null;
    }
    deck.cardInputModeId = cardInputModeId;
  }

  get publicDecks() {
    if (!this.myInfo) {
      return [];
    }
    const myDeckIds = this.myInfo.myDecks.map((deck) => deck.id);
    return this.myInfo.publicDecks.filter(
      (publicDeck) => !myDeckIds.includes(publicDeck.id),
    );
  }

  get myDecks(): (DeckWithCardsWithReviewType & { isPublic: boolean })[] {
    if (!this.myInfo) {
      return [];
    }
    const cardsToReview = this.myInfo.cardsToReview;

    return this.myInfo.myDecks.map((deck) => ({
      ...deck,
      isPublic: deck.isPublic,
      cardsToReview: getCardsToReview(deck, cardsToReview),
    }));
  }

  get myDecksWithoutFolder(): DeckListItem[] {
    // filter my decks if they are not in this.myInfo.folders
    const decksWithinFolder =
      this.myInfo?.folders.map((folder) => folder.deck_id) ?? [];

    return this.myDecks
      .filter((deck) => !decksWithinFolder.includes(deck.id))
      .map((deck) => ({
        ...deck,
        type: "deck",
      }));
  }

  checkFolderRequiresUpdating() {
    const folder = this.selectedFolder;
    if (!folder || !this.myInfo) return;

    const authorsDecksIds = this.myInfo.folders
      .filter((f) => f.folder_id === folder.id)
      .map((d) => d.deck_id)
      .filter(boolNarrow);

    const usersDeckIds = folder.decks.map((d) => d.id);

    const decksInFolderNotAddedByUser = arrayDifference(
      authorsDecksIds,
      usersDeckIds,
    );

    decksInFolderNotAddedByUser.forEach((deckId) => {
      this.addDeckToMine(deckId, true);
    });
  }

  get myFoldersAsDecks(): DeckListItem[] {
    if (!this.myInfo || this.myInfo.folders.length === 0) {
      return [];
    }

    const myDecks: DeckWithCardsWithReviewType[] = this.myDecks;

    const map = new Map<
      number,
      {
        folderName: string;
        folderDescription: string | null;
        folderAuthorId: number;
        folderShareId: string;
        folderIsPublic: boolean;
        decks: DeckWithCardsWithReviewType[];
      }
    >();

    this.myInfo.folders.forEach((folder) => {
      const mapItem = map.get(folder.folder_id) ?? {
        folderName: folder.folder_title,
        folderDescription: folder.folder_description,
        folderAuthorId: folder.folder_author_id,
        folderShareId: folder.folder_share_id,
        // Actually checked via user ownership
        folderIsPublic: false,
        decks: [],
      };
      const deck = myDecks.find((deck) => deck.id === folder.deck_id);
      if (deck) {
        mapItem.decks.push(deck);
      }
      map.set(folder.folder_id, mapItem);
    });

    return Array.from(map.entries()).map(([folderId, mapItem]) => ({
      id: folderId,
      decks: mapItem.decks,
      cardsToReview: mapItem.decks.reduce<DeckCardDbTypeWithType[]>(
        (acc, deck) => acc.concat(deck.cardsToReview),
        [],
      ),
      type: "folder",
      name: mapItem.folderName,
      isPublic: mapItem.folderIsPublic,
      shareId: mapItem.folderShareId,
      description: mapItem.folderDescription,
      authorId: mapItem.folderAuthorId,
    }));
  }

  get shouldShowMyDecksToggle() {
    return this.myDecks.length > this.collapsedDeckLimit;
  }

  get myDeckItemsVisible(): DeckListItem[] {
    const sortedListItems = this.myDeckItems;

    if (this.isMyDecksExpanded.value) {
      return sortedListItems;
    }

    return sortedListItems.slice(0, this.collapsedDeckLimit);
  }

  get myDeckItems(): DeckListItem[] {
    return this.myFoldersAsDecks
      .concat(this.myDecksWithoutFolder)
      .sort((a, b) => {
        // sort decks by cardsToReview count with type 'repeat' first, then with type 'new'
        const aRepeatCount = a.cardsToReview.filter(
          (card) => card.type === "repeat",
        ).length;

        const bRepeatCount = b.cardsToReview.filter(
          (card) => card.type === "repeat",
        ).length;

        if (aRepeatCount !== bRepeatCount) {
          return bRepeatCount - aRepeatCount;
        }

        const aNewCount = a.cardsToReview.length - aRepeatCount;
        const bNewCount = b.cardsToReview.length - bRepeatCount;
        if (aNewCount !== bNewCount) {
          return bNewCount - aNewCount;
        }
        return a.name.localeCompare(b.name);
      });
  }

  get areAllDecksReviewed() {
    return (
      this.myDecks.length > 0 &&
      this.myDecks.every((deck) => deck.cardsToReview.length === 0)
    );
  }

  get cardsToReviewCount() {
    return this.myDecks.reduce((acc, deck) => {
      return (
        acc + deck.cardsToReview.filter((card) => card.type === "repeat").length
      );
    }, 0);
  }

  get newCardsCount() {
    return this.myDecks.reduce((acc, deck) => {
      return (
        acc + deck.cardsToReview.filter((card) => card.type === "new").length
      );
    }, 0);
  }

  get cardsTotalCount() {
    return this.myDecks.reduce((acc, deck) => {
      return acc + deck.deckCards.length;
    }, 0);
  }

  async deleteFolder(folder: FolderWithDeckIdDbType) {
    const isAuthor = folder.folder_author_id === userStore.myId;
    const confirmMessage = isAuthor
      ? t("delete_folder_confirm_author")
      : t("delete_folder_confirm_shared");

    const isConfirmed = await showConfirm(confirmMessage);
    if (!isConfirmed) {
      return;
    }

    hapticImpact("heavy");
    this.isAppLoading = true;

    api.folder.delete
      .mutate({ folderId: folder.folder_id })
      .then(() => api.me.info.query())
      .then(
        action((result) => {
          if (!result) {
            return;
          }
          this.myInfo = result;
          screenStore.go({ type: "main" });
        }),
      )
      .catch((e) => {
        reportHandledError(`Unable to remove folder ${folder.folder_id}`, e);
      })
      .finally(
        action(() => {
          this.isAppLoading = false;
        }),
      );
  }

  async removeDeck(deck: DeckWithCardsDbType) {
    const isAuthor = deck.authorId === userStore.myId;
    const confirmMessage = isAuthor
      ? t("delete_deck_confirm_author")
      : t("delete_deck_confirm_shared");

    const isConfirmed = await showConfirm(confirmMessage);
    if (!isConfirmed) {
      return;
    }

    hapticImpact("heavy");
    this.isAppLoading = true;

    api.deck.removeFromMine
      .mutate({ deckId: deck.id })
      .then(() => api.me.info.query())
      .then(
        action((result) => {
          if (!result) {
            return;
          }
          this.myInfo = result;
          screenStore.go({ type: "main" });
        }),
      )
      .catch((e) => {
        reportHandledError(`Unable to remove deck ${deck.id}`, e);
      })
      .finally(
        action(() => {
          this.isAppLoading = false;
        }),
      );
  }

  updateFolders(body: FolderWithDeckIdDbType[]) {
    if (!this.myInfo) {
      return;
    }
    this.myInfo.folders = body;
  }

  updateCardsToReview(body: CardToReviewDbType[]) {
    if (!this.myInfo) {
      return;
    }
    this.myInfo.cardsToReview = body;
  }

  async load() {
    const result = await this.myInfoRequest.execute();
    if (result.status === "error") {
      console.log("mc: error in myInfoRequest", result.error);
      return;
    }
    const userData = result.data;
    if (!userData) {
      console.log("mc: no userData");
      return;
    }
    runInAction(() => {
      this.myInfo = userData;
    });
    userStore.setUser(userData.user, userData.plans);
  }

  async onDuplicateDeck(deckId: number) {
    const isConfirmed = await showConfirm(t("duplicate_deck_confirm"));
    if (!isConfirmed) {
      return;
    }

    hapticImpact("heavy");
    runInAction(() => {
      this.isAppLoading = true;
    });
    api.deck.duplicate
      .mutate({ deckId })
      .then(() => {
        screenStore.go({ type: "main" });
      })
      .finally(
        action(() => {
          this.isAppLoading = false;
        }),
      );
  }

  async onDuplicateFolder(folderId: number) {
    const isConfirmed = await showConfirm(t("duplicate_folder_confirm"));
    if (!isConfirmed) {
      return;
    }

    hapticImpact("heavy");
    runInAction(() => {
      this.isAppLoading = true;
    });

    api.folder.duplicate
      .mutate({ folderId })
      .then(() => {
        screenStore.go({ type: "main" });
      })
      .finally(
        action(() => {
          this.isAppLoading = false;
        }),
      );
  }

  async handleStartParam(startParam?: string) {
    if (this.isStartParamHandled) {
      return;
    }
    this.isStartParamHandled = true;
    if (!startParam) {
      return;
    }

    if (startParam === StartParamType.RepeatAll) {
      this.isAppLoading = true;
      when(() => !!this.myInfo)
        .then(() => {
          screenStore.go({ type: "reviewAll" });
        })
        .finally(
          action(() => {
            this.isAppLoading = false;
          }),
        );
    } else if (startParam === StartParamType.DeckCatalog) {
      screenStore.go({ type: "deckCatalog" });
    } else if (startParam === StartParamType.Debug) {
      screenStore.go({ type: "debug" });
    } else if (startParam === StartParamType.Components) {
      screenStore.go({ type: "componentCatalog" });
    } else if (startParam === StartParamType.Settings) {
      screenStore.goToUserSettings();
    } else if (startParam === StartParamType.Break) {
      throw new Error("Test exception for debugging");
    } else if (startParam === StartParamType.Pro) {
      screenStore.go({ type: "plans" });
    } else {
      this.isAppLoading = true;
      await when(() => !!this.myInfo);

      api.getByShareId
        .query({ shareId: startParam })
        .then(
          action((sharedDeckResponse) => {
            if ("deck" in sharedDeckResponse) {
              const deck = sharedDeckResponse.deck;
              assert(this.myInfo);
              if (this.myInfo.myDecks.find((myDeck) => myDeck.id === deck.id)) {
                screenStore.go({ type: "deckMine", deckId: deck.id });
                return;
              }

              if (
                this.publicDecks.find((publicDeck) => publicDeck.id === deck.id)
              ) {
                this.replaceDeck(deck);
                screenStore.go({
                  type: "deckPublic",
                  deckId: deck.id,
                });
                return;
              }

              this.myInfo.publicDecks.push(deck);
              screenStore.go({ type: "deckPublic", deckId: deck.id });
            }

            if ("folder" in sharedDeckResponse) {
              const folder = sharedDeckResponse.folder;
              this.addFolder(folder);
            }
          }),
        )
        .catch((e) => {
          reportHandledError("Error while retrieving shared deck", e, {
            shareId: startParam,
          });
        })
        .finally(
          action(() => {
            this.isAppLoading = false;
          }),
        );
    }
  }

  isDeckFolderAdded = (item: {
    type: "folder" | "deck";
    id: number;
  }): { isMineDeck: boolean; isMineFolder: boolean } => {
    const myDeckIds = this.myDeckIds;
    const myFoldersIds = this.myFoldersIds;

    const isMineFolder =
      item.type === "folder" ? myFoldersIds.includes(item.id) : false;
    const isMineDeck =
      item.type === "deck" ? myDeckIds.includes(item.id) : false;

    return { isMineFolder, isMineDeck };
  };

  get myFoldersIds() {
    return this.myFoldersAsDecks.map((folder) => folder.id);
  }

  get myDeckIds() {
    return this.myDecks.map((deck) => deck.id);
  }
}

const getCardsToReview = (
  deck: DeckWithCardsDbType,
  cardsToReview: CardToReviewDbType[],
) => {
  const map = new Map<number, CardReviewType>();

  cardsToReview.forEach((cardToReview) => {
    if (cardToReview.deckId == deck.id) {
      map.set(cardToReview.id, cardToReview.type);
    }
  });

  return deck.deckCards
    .filter((card) => map.has(card.id))
    .map((card) => ({
      ...card,
      type: map.get(card.id)!,
    }))
    .slice()
    .sort((card) => (card.type === "repeat" ? -1 : 1));
};

export const deckListStore = new DeckListStore();
