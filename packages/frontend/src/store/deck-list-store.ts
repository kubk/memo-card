import { action, makeAutoObservable, when } from "mobx";
import { appLoaderStore } from "./app-loader-store.ts";
import { type RouterOutput } from "api";
import { type DeckCardDbType, type DeckWithCardsDbType } from "api";

type MyInfoResponse = RouterOutput["me"]["info"];
import { screenStore } from "./screen-store.ts";
import {
  CardReviewType,
  type CardToReviewDbType,
  createInitialFsrsReviewState,
  type FsrsReviewState,
} from "api";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";
import { BooleanToggle } from "mobx-form-lite";
import { userStore } from "./user-store.ts";
import { showConfirm } from "../lib/platform/show-confirm.ts";
import { t } from "../translations/t.ts";
import { platform } from "../lib/platform/platform.ts";
import { type FolderWithDeckIdDbType } from "api";
import { api } from "../api/trpc-api.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";
import { StartParamType } from "./routing/route-types.ts";
import { makeQuery } from "../lib/mobx-query-lite/make-query.ts";
import { type DeckListDeck } from "./routing/route-types.ts";

export type DeckCardDbTypeWithType = DeckCardDbType & {
  type: CardReviewType;
} & FsrsReviewState;

export type DeckWithCardsWithReviewType = DeckListDeck & {
  cardsToReview: DeckCardDbTypeWithType[];
};

const createNewCardReviewState = () => createInitialFsrsReviewState(new Date());

const authOptionalScreenTypes = ["about", "componentCatalog", "debug"];

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

export type DeckListFolder = Extract<DeckListItem, { type: "folder" }>;

class DeckListStore {
  myInfoQuery = makeQuery({
    key: "me.info",
    query: async () => {
      try {
        const userData = await api.me.info.query();
        userStore.setUser(userData.user, userData.plan);
        if (screenStore.screen.type === "browserLogin") {
          screenStore.replace({ type: "main" });
        }
        return userData;
      } catch (error) {
        console.log("mc: error in myInfoQuery", error);
        if (platform instanceof BrowserPlatform && !this.isAuthOptionalScreen) {
          screenStore.push({ type: "browserLogin" });
        }
        throw error;
      }
    },
  });

  isStartParamHandled = false;

  skeletonLoaderData = { publicCount: 3, myDecksCount: 3 };

  isMyDecksExpanded = new BooleanToggle(false);

  constructor() {
    makeAutoObservable(
      this,
      {
        searchDeckById: false,
        searchFolderById: false,
        isItemAdded: false,
      },
      { autoBind: true },
    );
  }

  get collapsedDeckLimit() {
    return 6;
  }

  get myInfo(): MyInfoResponse | undefined {
    return this.myInfoQuery.data;
  }

  loadFirstTime(startParam?: string) {
    this.handleStartParam(startParam);
  }

  private get isAuthOptionalScreen() {
    return authOptionalScreenTypes.includes(screenStore.screen.type);
  }

  addCardOptimistic(card: DeckCardDbType) {
    const deck = this.searchDeckById(card.deckId);
    if (!deck || !this.myInfo) {
      return;
    }
    deck.deckCards.push(card);
    this.myInfo.cardsToReview.push({
      id: card.id,
      deckId: card.deckId,
      type: "new",
      ...createNewCardReviewState(),
    });
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
        return this.myInfoQuery.invalidate();
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
      .then(() => this.myInfoQuery.invalidate())
      .catch((error) => {
        reportHandledError("Error while adding folder to mine", error, {
          folderId,
        });
      });
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

  replaceDeck(deck: DeckWithCardsDbType, addToMine = false) {
    if (!this.myInfo) {
      return;
    }
    const ownedDeckIndex = this.myInfo.myDecks.findIndex(
      (myDeck) => myDeck.id === deck.id,
    );
    if (ownedDeckIndex !== -1) {
      this.myInfo.myDecks[ownedDeckIndex] = deck;
      return;
    }

    const publicDeckIndex = this.myInfo.publicDecks.findIndex(
      (publicDeck) => publicDeck.id === deck.id,
    );
    if (publicDeckIndex !== -1) {
      const publicDeck = this.myInfo.publicDecks[publicDeckIndex];
      this.myInfo.publicDecks[publicDeckIndex] = {
        ...publicDeck,
        ...deck,
        authorId: publicDeck.authorId,
        deckCategory: publicDeck.deckCategory,
      };
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
    const hasManyDecks = this.myDecks.length > this.collapsedDeckLimit;
    const hasAtLeastOneFolder = this.myFoldersAsDecks.length > 0;
    return hasManyDecks || hasAtLeastOneFolder;
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

  async deleteFolder(folder: FolderWithDeckIdDbType) {
    const isAuthor = folder.folder_author_id === userStore.myId;
    const confirmMessage = isAuthor
      ? t("delete_folder_confirm_author")
      : t("delete_folder_confirm_shared");

    const isConfirmed = await showConfirm(confirmMessage);
    if (!isConfirmed) {
      return;
    }

    platform.haptic("heavy");
    appLoaderStore.enable();

    api.folder.delete
      .mutate({ folderId: folder.folder_id })
      .then(() => api.me.info.query())
      .then(
        action((result) => {
          if (!result) {
            return;
          }
          this.setMyInfo(result);
          screenStore.push({ type: "main" });
        }),
      )
      .catch((e) => {
        reportHandledError(`Unable to remove folder ${folder.folder_id}`, e);
      })
      .finally(appLoaderStore.disable);
  }

  async removeDeck(deck: Pick<DeckListDeck, "id" | "authorId">) {
    const isAuthor = this.isDeckOwner(deck);
    const confirmMessage = isAuthor
      ? t("delete_deck_confirm_author")
      : t("delete_deck_confirm_shared");

    const isConfirmed = await showConfirm(confirmMessage);
    if (!isConfirmed) {
      return;
    }

    platform.haptic("heavy");
    appLoaderStore.enable();

    api.deck.removeFromMine
      .mutate({ deckId: deck.id })
      .then(() => api.me.info.query())
      .then(
        action((result) => {
          if (!result) {
            return;
          }
          this.setMyInfo(result);
          screenStore.push({ type: "main" });
        }),
      )
      .catch((e) => {
        reportHandledError(`Unable to remove deck ${deck.id}`, e);
      })
      .finally(appLoaderStore.disable);
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

  private setMyInfo(userData: MyInfoResponse) {
    this.myInfoQuery.setData(userData);
    userStore.setUser(userData.user, userData.plan);
  }

  async onDuplicateDeck(deckId: number) {
    const isConfirmed = await showConfirm(t("duplicate_deck_confirm"));
    if (!isConfirmed) {
      return;
    }

    platform.haptic("heavy");
    appLoaderStore.enable();

    api.deck.duplicate
      .mutate({ deckId })
      .then(() => {
        screenStore.push({ type: "main" });
        this.myInfoQuery.invalidate();
      })
      .catch((e) => {
        reportHandledError("Error duplicating deck", e);
      })
      .finally(appLoaderStore.disable);
  }

  async onDuplicateFolder(folderId: number) {
    const isConfirmed = await showConfirm(t("duplicate_folder_confirm"));
    if (!isConfirmed) {
      return;
    }

    platform.haptic("heavy");
    appLoaderStore.enable();

    api.folder.duplicate
      .mutate({ folderId })
      .then(() => {
        screenStore.push({ type: "main" });
        this.myInfoQuery.invalidate();
      })
      .catch((e) => {
        reportHandledError("Error duplicating folder", e);
      })
      .finally(appLoaderStore.disable);
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
      appLoaderStore.enable();
      when(() => !!this.myInfo)
        .then(() => {
          screenStore.push({ type: "reviewAll" });
        })
        .finally(appLoaderStore.disable);
    } else if (startParam === StartParamType.DeckCatalog) {
      screenStore.push({ type: "deckCatalog" });
    } else if (startParam === StartParamType.Debug) {
      screenStore.push({ type: "debug" });
    } else if (startParam === StartParamType.Components) {
      screenStore.push({ type: "componentCatalog" });
    } else if (startParam === StartParamType.Settings) {
      screenStore.goToUserSettings();
    } else if (startParam === StartParamType.Break) {
      throw new Error("Test exception for debugging");
    } else if (startParam === StartParamType.Pro) {
      screenStore.push({ type: "plans", planType: "pro" });
    } else {
      appLoaderStore.enable();
      await when(() => !!this.myInfo);

      api.getByShareId
        .query({ shareId: startParam })
        .then(async (sharedDeckResponse) => {
          await this.myInfoQuery.invalidate({ refetchInactive: true });

          if ("deck" in sharedDeckResponse) {
            const deck = sharedDeckResponse.deck;
            screenStore.push({
              type: "deckPreview",
              deckId: deck.id,
            });
          }

          if ("folder" in sharedDeckResponse) {
            screenStore.push({
              type: "folderPreview",
              folderId: sharedDeckResponse.folder.id,
            });
          }
        })
        .catch((e) => {
          reportHandledError("Error while retrieving shared deck", e, {
            shareId: startParam,
          });
        })
        .finally(appLoaderStore.disable);
    }
  }

  isItemAdded = (item: { type: "folder" | "deck"; id: number }) => {
    return item.type === "folder"
      ? this.myFoldersIds.includes(item.id)
      : this.myDeckIds.includes(item.id);
  };

  get myFoldersIds() {
    return this.myFoldersAsDecks.map((folder) => folder.id);
  }

  get myDeckIds() {
    return this.myDecks.map((deck) => deck.id);
  }

  isFolderOwner(folder: { authorId: number }) {
    return folder.authorId === userStore.myId;
  }

  canSeeDuplicate(item: { authorId: number | null }) {
    return item.authorId === userStore.myId;
  }

  canRemoveFolder(folder: { id: number }) {
    return this.myFoldersIds.includes(folder.id);
  }

  isDeckOwner(deck: Pick<DeckListDeck, "authorId">) {
    return deck.authorId === userStore.myId;
  }

  canRemoveDeck(deck: Pick<DeckListDeck, "authorId" | "id">) {
    return this.isDeckOwner(deck) || this.myDeckIds.includes(deck.id);
  }

  deckIdsOwnedByMe() {
    return this.myDecks.filter(this.isDeckOwner).map((deck) => deck.id);
  }
}

const getCardsToReview = (
  deck: DeckListDeck,
  cardsToReview: CardToReviewDbType[],
) => {
  const map = new Map<number, CardToReviewDbType>();

  cardsToReview.forEach((cardToReview) => {
    if (cardToReview.deckId == deck.id) {
      map.set(cardToReview.id, cardToReview);
    }
  });

  return deck.deckCards
    .filter((card) => map.has(card.id))
    .map((card) => {
      const reviewData = map.get(card.id);
      if (!reviewData) {
        throw new Error(`Review data not found for card ${card.id}`);
      }
      return {
        ...card,
        ...reviewData,
      };
    })
    .slice()
    .sort((card) => (card.type === "repeat" ? -1 : 1));
};

export const deckListStore = new DeckListStore();
