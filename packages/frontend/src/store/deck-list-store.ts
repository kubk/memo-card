import { action, makeAutoObservable, when } from "mobx";
import { appLoaderStore } from "./app-loader-store.ts";
import { type RouterOutput } from "api";
import {
  type DeckCardDbType,
  type DeckWithCardsDbType,
  type LibraryPatch,
} from "api";

type MyInfoResponse = RouterOutput["me"]["info"];
import { screenStore } from "./screen-store.ts";
import {
  CardReviewType,
  type CardToReviewDbType,
  type FsrsReviewState,
} from "api";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";
import { BooleanToggle } from "mobx-form-lite";
import { userStore } from "./user-store.ts";
import { platform } from "../lib/platform/platform.ts";
import { isAppStartParam } from "api";
import { api } from "../api/trpc-api.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";
import { makeQuery } from "mobx-query-lite";
import { type DeckListDeck } from "./deck-types.ts";
import { deckDetailsStore } from "./deck-details-store.ts";
import { isTrpcNotFoundError } from "../api/is-trpc-not-found-error.ts";
import { showAlert } from "../lib/platform/show-alert.ts";
import { t } from "../translations/t.ts";

export type DeckCardDbTypeWithType = DeckCardDbType & {
  type: CardReviewType;
} & FsrsReviewState;

export type DeckWithCardsWithReviewType = DeckListDeck & {
  cardsToReview: DeckCardDbTypeWithType[];
};

const authOptionalScreenTypes = ["about", "browserLogin"];

export type DeckListItem = {
  id: string;
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
    }
);

type LibraryItemRef = { type: "deck" | "folder"; id: string };

const getLibraryItemKey = (item: LibraryItemRef) => `${item.type}:${item.id}`;

const addProgressMs = 1000;

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

  itemsBeingAdded = new Set<string>();

  itemsWithAddProgress = new Set<string>();

  skeletonLoaderData = { publicCount: 3, myDecksCount: 3 };

  isMyDecksExpanded = new BooleanToggle(false);

  constructor() {
    makeAutoObservable(
      this,
      {
        searchDeckById: false,
        searchDeckWithCardsById: false,
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

  isAddProgressVisible(item: LibraryItemRef) {
    return this.itemsWithAddProgress.has(getLibraryItemKey(item));
  }

  isItemInCollection(item: LibraryItemRef) {
    return this.isItemAdded(item) && !this.isAddProgressVisible(item);
  }

  async addToCollection(item: LibraryItemRef) {
    if (this.isItemAdded(item)) {
      return;
    }

    const key = getLibraryItemKey(item);
    this.itemsBeingAdded.add(key);
    this.itemsWithAddProgress.add(key);
    setTimeout(
      action(() => {
        if (this.itemsWithAddProgress.delete(key)) {
          platform.haptic("medium");
        }
      }),
      addProgressMs,
    );

    try {
      if (item.type === "deck") {
        await api.deck.addToMine.mutate({ deckId: item.id });
      } else {
        await api.folder.addToMine.mutate({ folderId: item.id });
      }
      await this.myInfoQuery.invalidate();
    } catch (error) {
      reportHandledError("Error while adding item to collection", error, item);
      showAlert(t("error_contact_support"));
      this.itemsWithAddProgress.delete(key);
    } finally {
      this.itemsBeingAdded.delete(key);
    }
  }

  searchDeckById(deckId: string) {
    if (!this.myInfo) {
      return null;
    }
    const decksToSearch = this.myInfo.myDecks.concat(this.publicDecks);
    return decksToSearch.find((deck) => deck.id === deckId);
  }

  searchDeckWithCardsById(deckId: string) {
    const myDeck = this.myInfo?.myDecks.find((deck) => deck.id === deckId);
    return myDeck ?? deckDetailsStore.getQuery(deckId).data ?? null;
  }

  searchFolderById(folderId: string) {
    if (!this.myInfo) {
      return null;
    }
    const foldersToSearch = this.myInfo.folders;
    return foldersToSearch.find((folder) => folder.folder_id === folderId);
  }

  applyLibraryPatch({ decks, folders, cardsToReview }: LibraryPatch) {
    decks.forEach((deck) => deckDetailsStore.setDeck(deck));

    const myInfo = this.myInfo;
    if (!myInfo) {
      return;
    }
    decks.forEach((deck) => upsertDeck(myInfo, deck));
    myInfo.folders = folders;
    myInfo.cardsToReview = cardsToReview;
    this.myInfoQuery.setData(myInfo);
  }

  get deckVariables() {
    return this.myInfo?.myDecks.flatMap((deck) => deck.variables ?? []) ?? [];
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
      string,
      {
        folderName: string;
        folderDescription: string | null;
        folderAuthorId: number;
        folderIsPublic: boolean;
        decks: DeckWithCardsWithReviewType[];
      }
    >();

    this.myInfo.folders.forEach((folder) => {
      const mapItem = map.get(folder.folder_id) ?? {
        folderName: folder.folder_title,
        folderDescription: folder.folder_description,
        folderAuthorId: folder.folder_author_id,
        folderIsPublic: folder.folder_is_public,
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
        // Prioritize decks with repeat cards, then new cards, then alphabetical order.
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

  async handleStartParam(startParam?: string) {
    if (this.isStartParamHandled) {
      return;
    }
    this.isStartParamHandled = true;
    if (!startParam) {
      return;
    }

    const appStartParam = isAppStartParam(startParam) ? startParam : null;
    if (appStartParam === "repeat_all") {
      appLoaderStore.enable();
      when(() => !!this.myInfo)
        .then(() => {
          screenStore.push({ type: "reviewAll" });
        })
        .finally(appLoaderStore.disable);
    } else if (appStartParam === "catalog") {
      screenStore.push({ type: "deckCatalog" });
    } else if (appStartParam === "ui_kit") {
      window.location.replace("/playground/");
    } else if (appStartParam === "settings") {
      screenStore.goToUserSettings();
    } else if (appStartParam === "pro") {
      screenStore.push({ type: "plans", planType: "pro" });
    } else {
      appLoaderStore.enable();
      const sharedItemPromise = api.getByShareId.query({ shareId: startParam });
      const [sharedItem] = await Promise.allSettled([
        sharedItemPromise,
        when(() => !!this.myInfo),
      ]);
      const shouldRefetch =
        sharedItem.status === "rejected" &&
        !isTrpcNotFoundError(sharedItem.reason);

      (shouldRefetch
        ? api.getByShareId.query({ shareId: startParam })
        : sharedItemPromise
      )
        .then((sharedDeckResponse) => {
          if ("deck" in sharedDeckResponse) {
            const deck = sharedDeckResponse.deck;
            deckDetailsStore.setDeck(deck);
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
          if (isTrpcNotFoundError(e)) {
            screenStore.replace({ type: "sharedDeckNotFound" });
            return;
          }

          reportHandledError("Error while retrieving shared deck", e, {
            shareId: startParam,
          });
        })
        .finally(appLoaderStore.disable);
    }
  }

  isItemAdded = (item: LibraryItemRef) => {
    const isInLibrary =
      item.type === "folder"
        ? this.myFoldersIds.includes(item.id)
        : this.myDeckIds.includes(item.id);
    return isInLibrary || this.itemsBeingAdded.has(getLibraryItemKey(item));
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

  canRemoveFolder(folder: { id: string }) {
    return this.myFoldersIds.includes(folder.id);
  }

  isDeckOwner(deck: Pick<DeckListDeck, "authorId">) {
    return deck.authorId === userStore.myId;
  }

  canRemoveDeck(deck: Pick<DeckListDeck, "id">) {
    return this.myDeckIds.includes(deck.id);
  }

  deckIdsOwnedByMe() {
    return this.myDecks.filter(this.isDeckOwner).map((deck) => deck.id);
  }
}

const upsertDeck = (myInfo: MyInfoResponse, deck: DeckWithCardsDbType) => {
  const myDeckIndex = myInfo.myDecks.findIndex(({ id }) => id === deck.id);
  if (myDeckIndex !== -1) {
    myInfo.myDecks[myDeckIndex] = { ...myInfo.myDecks[myDeckIndex], ...deck };
    return;
  }

  const publicDeckIndex = myInfo.publicDecks.findIndex(
    ({ id }) => id === deck.id,
  );
  if (publicDeckIndex !== -1) {
    const publicDeck = myInfo.publicDecks[publicDeckIndex];
    myInfo.publicDecks[publicDeckIndex] = {
      ...publicDeck,
      ...deck,
      authorId: publicDeck.authorId,
      deckCategory: publicDeck.deckCategory,
    };
    return;
  }

  myInfo.myDecks.push(deck);
};

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
