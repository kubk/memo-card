import { when } from "mobx";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { inMemoryCache } from "../../../lib/mobx-query-lite/cache.ts";
import { queryRegistry } from "../../../lib/mobx-query-lite/make-query.ts";
import { FolderScreenStore } from "./folder-screen-store.ts";

const mocks = vi.hoisted(() => ({
  folderWithDecksCards: vi.fn(),
  addFolderToMine: vi.fn(),
  myFoldersAsDecks: [] as unknown[],
  screen: { type: "main" } as unknown,
}));

vi.mock("../../../api/trpc-api.ts", () => ({
  api: {
    folder: {
      folderWithDecksCards: { query: mocks.folderWithDecksCards },
    },
  },
}));

vi.mock("../../../store/deck-list-store.ts", () => ({
  deckListStore: {
    get myFoldersAsDecks() {
      return mocks.myFoldersAsDecks;
    },
    isFolderOwner: (folder: { authorId: number }) => folder.authorId === 1,
    addFolderToMine: mocks.addFolderToMine,
  },
}));

vi.mock("../../../store/user-store.ts", () => ({
  userStore: { myId: 1 },
}));

vi.mock("../../../store/screen-store.ts", () => ({
  screenStore: {
    get screen() {
      return mocks.screen;
    },
  },
}));

const folder = {
  id: 7,
  title: "Travel",
  authorId: 2,
  description: "Travel decks",
  shareId: "travel-folder",
  isPublic: true,
  decks: [
    {
      id: 42,
      createdAt: "2026-01-01T00:00:00.000Z",
      name: "Travel English",
      authorId: 2,
      description: "Airport phrases",
      shareId: "travel",
      isPublic: true,
      speakLocale: null,
      speakField: null,
      speakAutoAi: false,
      reverseCards: false,
      cardInputModeId: null,
      availableIn: "en",
      categoryId: null,
      deckCards: [],
    },
  ],
};

describe("FolderScreenStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.myFoldersAsDecks.length = 0;
    mocks.screen = { type: "main" };
    queryRegistry.clear();
    inMemoryCache.clear();
    mocks.folderWithDecksCards.mockResolvedValue({ folder });
  });

  it("uses route preview data while catalog details load", async () => {
    const { decks: _decks, ...previewFolder } = folder;
    mocks.screen = {
      type: "folderPreview",
      folderId: folder.id,
      state: { folder: previewFolder },
    };
    const store = new FolderScreenStore(folder.id);

    expect(store.folder?.name).toBe("Travel");
    expect(store.folder?.decks).toEqual([]);
    expect(store.isInitialLoading).toBe(true);

    await when(() => store.folder?.decks.length === 1);

    expect(store.folder?.decks).toHaveLength(1);
    expect(store.isInitialLoading).toBe(false);
  });

  it("loads an unowned folder once and reuses its cached details", async () => {
    const firstStore = new FolderScreenStore(folder.id);
    expect(firstStore.isInitialLoading).toBe(true);

    await when(() => firstStore.folder?.decks.length === 1);

    expect(firstStore.isInitialLoading).toBe(false);
    expect(firstStore.folder?.name).toBe("Travel");

    const secondStore = new FolderScreenStore(folder.id);
    expect(secondStore.folder?.decks).toHaveLength(1);
    expect(mocks.folderWithDecksCards).toHaveBeenCalledTimes(1);
  });

  it("uses owned folder data without starting the detail query", async () => {
    mocks.myFoldersAsDecks.push({
      type: "folder",
      id: folder.id,
      name: folder.title,
      description: folder.description,
      authorId: 1,
      shareId: folder.shareId,
      isPublic: false,
      decks: [],
      cardsToReview: [],
    });
    const store = new FolderScreenStore(folder.id);

    expect(store.folder?.name).toBe("Travel");
    expect(store.isInitialLoading).toBe(false);
    await Promise.resolve();
    expect(mocks.folderWithDecksCards).not.toHaveBeenCalled();
  });
});
