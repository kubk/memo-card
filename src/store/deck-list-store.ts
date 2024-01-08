import { action, makeAutoObservable, when } from "mobx";
import {
  addDeckToMineRequest,
  deckWithCardsRequest,
  deleteFolderRequest,
  getSharedDeckRequest,
  myInfoRequest,
  removeDeckFromMineRequest,
} from "../api/api.ts";
import { MyInfoResponse } from "../../functions/my-info.ts";
import {
  DeckCardDbType,
  DeckWithCardsDbType,
} from "../../functions/db/deck/decks-with-cards-schema.ts";
import { RouteType, screenStore } from "./screen-store.ts";
import { CardToReviewDbType } from "../../functions/db/deck/get-cards-to-review-db.ts";
import { assert } from "../lib/typescript/assert.ts";
import { ReviewStore } from "../screens/deck-review/store/review-store.ts";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";
import { BooleanToggle } from "../lib/mobx-form/boolean-toggle.ts";
import { UserFoldersDbType } from "../../functions/db/folder/get-folders-with-decks-db.tsx";
import { userStore } from "./user-store.ts";

export enum StartParamType {
  RepeatAll = "repeat_all",
}

export type DeckCardDbTypeWithType = DeckCardDbType & {
  type: "new" | "repeat";
};

export type DeckWithCardsWithReviewType = DeckWithCardsDbType & {
  cardsToReview: DeckCardDbTypeWithType[];
};

export type DeckListItem = {
  id: number;
  cardsToReview: DeckCardDbTypeWithType[];
  name: string;
  description: string | null;
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

const collapsedDecksLimit = 3;

export class DeckListStore {
  myInfo?: Omit<MyInfoResponse, "user">;
  isMyInfoLoading = false;

  isFullScreenLoaderVisible = false;
  isSharedDeckLoaded = false;

  isReviewAllLoaded = false;

  skeletonLoaderData = { publicCount: 3, myDecksCount: 3 };

  isDeckCardsLoading = false;

  isMyDecksExpanded = new BooleanToggle(false);

  constructor() {
    makeAutoObservable(this, { searchDeckById: false }, { autoBind: true });
  }

  loadFirstTime(startParam?: string) {
    this.load();
    this.handleStartParam(startParam);
  }

  load() {
    if (!this.myInfo) {
      // Stale-while-revalidate approach
      this.isMyInfoLoading = true;
    }

    myInfoRequest()
      .then(
        action((result) => {
          this.myInfo = result;
          userStore.setUser(result.user);
        }),
      )
      .finally(
        action(() => {
          this.isMyInfoLoading = false;
        }),
      );
  }

  async handleStartParam(startParam?: string) {
    if (!startParam) {
      return;
    }

    if (startParam === StartParamType.RepeatAll) {
      if (this.isReviewAllLoaded) {
        return;
      }

      this.isFullScreenLoaderVisible = true;
      when(() => !!this.myInfo)
        .then(() => {
          screenStore.go({ type: "reviewAll" });
        })
        .finally(
          action(() => {
            this.isFullScreenLoaderVisible = false;
            this.isReviewAllLoaded = true;
          }),
        );
    } else {
      if (this.isSharedDeckLoaded) {
        return;
      }

      this.isFullScreenLoaderVisible = true;
      await when(() => !!this.myInfo);

      getSharedDeckRequest(startParam)
        .then(
          action(({ deck }) => {
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
          }),
        )
        .catch((e) => {
          reportHandledError("Error while retrieving shared deck", e, {
            shareId: startParam,
          });
        })
        .finally(
          action(() => {
            this.isFullScreenLoaderVisible = false;
            this.isSharedDeckLoaded = true;
          }),
        );
    }
  }

  get canReview() {
    const deck = this.selectedDeck;
    assert(deck, "canReview requires a deck to be selected");

    return (
      deck.cardsToReview.length > 0 || screenStore.screen.type === "deckPublic"
    );
  }

  startDeckReview(reviewStore: ReviewStore) {
    if (!this.canReview) {
      return;
    }

    assert(deckListStore.selectedDeck, "No selected deck for review");
    if (screenStore.screen.type === "deckPublic") {
      deckListStore.addDeckToMine(deckListStore.selectedDeck.id);
    }

    reviewStore.startDeckReview(
      deckListStore.selectedDeck,
      userStore.isSpeakingCardsEnabled,
    );
  }

  addDeckToMine(deckId: number) {
    return addDeckToMineRequest({
      deckId,
    })
      .then(() => {
        this.load();
      })
      .catch((error) => {
        reportHandledError("Error while adding deck to mine", error, {
          deckId,
        });
      });
  }

  get canEditDeck() {
    const deck = this.selectedDeck;
    if (!deck) {
      return false;
    }
    return deck.author_id === userStore.myId || userStore.isAdmin;
  }

  openDeckFromCatalog(deck: DeckWithCardsDbType, isMine: boolean) {
    assert(this.myInfo);
    if (isMine) {
      screenStore.go({ type: "deckMine", deckId: deck.id });
      return;
    }
    if (!this.publicDecks.find((publicDeck) => publicDeck.id === deck.id)) {
      this.myInfo.publicDecks.push(deck);
    }
    screenStore.go({ type: "deckPublic", deckId: deck.id });

    this.isDeckCardsLoading = true;
    deckWithCardsRequest(deck.id)
      .then((deckWithCards) => {
        this.replaceDeck(deckWithCards);
      })
      .finally(
        action(() => {
          this.isDeckCardsLoading = false;
        }),
      );
  }

  goDeckById(deckId: number, backScreen?: RouteType) {
    if (!this.myInfo) {
      return null;
    }
    const myDeck = this.myInfo.myDecks.find((deck) => deck.id === deckId);
    if (myDeck) {
      screenStore.go({ type: "deckMine", deckId, backScreen });
      return;
    }
    const publicDeck = this.publicDecks.find((deck) => deck.id === deckId);
    if (publicDeck) {
      screenStore.go({ type: "deckPublic", deckId, backScreen });
      return;
    }
  }

  searchDeckById(deckId: number) {
    if (!this.myInfo) {
      return null;
    }
    const decksToSearch = this.myInfo.myDecks.concat(this.publicDecks);
    return decksToSearch.find((deck) => deck.id === deckId);
  }

  get selectedFolder() {
    const screen = screenStore.screen;
    assert(screen.type === "folderPreview", "screen is not folder preview");
    if (!this.myInfo) {
      return null;
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
    return folder.authorId === userStore.myId || userStore.isAdmin;
  }

  get isFolderReviewVisible() {
    return this.selectedFolder
      ? this.selectedFolder.cardsToReview.length > 0
      : false;
  }

  get selectedDeck(): DeckWithCardsWithReviewType | null {
    const screen = screenStore.screen;
    assert(screen.type === "deckPublic" || screen.type === "deckMine");
    if (!screen.deckId || !this.myInfo) {
      return null;
    }

    const deck = this.searchDeckById(screen.deckId);
    if (!deck) {
      return null;
    }

    const cardsToReview =
      screen.type === "deckPublic"
        ? deck.deck_card.map((card) => ({ ...card, type: "new" as const }))
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

  get publicDecks() {
    if (!this.myInfo) {
      return [];
    }
    const myDeckIds = this.myInfo.myDecks.map((deck) => deck.id);
    return this.myInfo.publicDecks.filter(
      (publicDeck) => !myDeckIds.includes(publicDeck.id),
    );
  }

  get myDecks(): DeckWithCardsWithReviewType[] {
    if (!this.myInfo) {
      return [];
    }
    const cardsToReview = this.myInfo.cardsToReview;

    return this.myInfo.myDecks.map((deck) => ({
      ...deck,
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

    const myDecks = this.myDecks;

    const map = new Map<
      number,
      {
        folderName: string;
        folderDescription: string | null;
        folderAuthorId: number;
        decks: DeckWithCardsWithReviewType[];
      }
    >();

    this.myInfo.folders.forEach((folder) => {
      const mapItem = map.get(folder.folder_id) ?? {
        folderName: folder.folder_title,
        folderDescription: folder.folder_description,
        folderAuthorId: folder.folder_author_id,
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
      description: mapItem.folderDescription,
      authorId: mapItem.folderAuthorId,
    }));
  }

  get shouldShowMyDecksToggle() {
    return deckListStore.myDecks.length > collapsedDecksLimit;
  }

  get myDeckItemsVisible(): DeckListItem[] {
    const sortedListItems = this.myFoldersAsDecks
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

    if (this.isMyDecksExpanded.value) {
      return sortedListItems;
    }
    return sortedListItems.slice(0, collapsedDecksLimit);
  }

  get areAllDecksReviewed() {
    return (
      this.myDecks.length > 0 &&
      this.myDecks.every((deck) => deck.cardsToReview.length === 0)
    );
  }

  get newCardsCount() {
    return this.myDecks.reduce((acc, deck) => {
      return (
        acc + deck.cardsToReview.filter((card) => card.type === "new").length
      );
    }, 0);
  }

  deleteFolder() {
    const folder = this.selectedFolder;
    if (!folder) {
      return;
    }

    this.isFullScreenLoaderVisible = true;

    deleteFolderRequest(folder.id)
      .then(() => myInfoRequest())
      .then(
        action((result) => {
          this.myInfo = result;
          screenStore.go({ type: "main" });
        }),
      )
      .catch((e) => {
        reportHandledError(`Unable to remove deck ${folder.id}`, e);
      })
      .finally(
        action(() => {
          this.isFullScreenLoaderVisible = false;
        }),
      );
  }

  removeDeck() {
    const deck = this.selectedDeck;
    if (!deck) {
      return;
    }

    this.isFullScreenLoaderVisible = true;

    removeDeckFromMineRequest({ deckId: deck.id })
      .then(() => myInfoRequest())
      .then(
        action((result) => {
          this.myInfo = result;
          screenStore.go({ type: "main" });
        }),
      )
      .catch((e) => {
        reportHandledError(`Unable to remove deck ${deck.id}`, e);
      })
      .finally(
        action(() => {
          this.isFullScreenLoaderVisible = false;
        }),
      );
  }

  updateFolders(body: UserFoldersDbType[]) {
    assert(this.myInfo, "myInfo is not loaded in updateFolders");
    this.myInfo.folders = body;
  }

  updateCardsToReview(body: CardToReviewDbType[]) {
    assert(this.myInfo, "myInfo is not loaded in updateCardsToReview");
    this.myInfo.cardsToReview = body;
  }
}

const getCardsToReview = (
  deck: DeckWithCardsDbType,
  cardsToReview: CardToReviewDbType[],
) => {
  const map = new Map<number, "new" | "repeat">();

  cardsToReview.forEach((cardToReview) => {
    if (cardToReview.deck_id == deck.id) {
      map.set(cardToReview.id, cardToReview.type);
    }
  });

  return deck.deck_card
    .filter((card) => map.has(card.id))
    .map((card) => ({
      ...card,
      type: map.get(card.id)!,
    }))
    .slice()
    .sort((card) => (card.type === "repeat" ? -1 : 1));
};

export const deckListStore = new DeckListStore();
