import { beforeEach, describe, expect, it, vi } from "vitest";
import { type RouterOutput } from "api";

type MyInfoResponse = RouterOutput["me"]["info"];
import { deckDetailsStore } from "./deck-details-store.ts";
import { deckListStore } from "./deck-list-store.ts";
import { screenStore } from "./screen-store.ts";

const mocks = vi.hoisted(() => ({
  getByShareIdQuery: vi.fn(),
  notFoundError: {},
  reportHandledError: vi.fn(),
}));

vi.mock("../api/trpc-api.ts", () => ({
  api: {
    deck: { addToMine: { mutate: vi.fn() } },
    folder: { addToMine: { mutate: vi.fn() } },
    getByShareId: { query: mocks.getByShareIdQuery },
    me: { info: { query: vi.fn() } },
  },
}));

vi.mock("../api/is-trpc-not-found-error.ts", () => ({
  isTrpcNotFoundError: (error: unknown) => error === mocks.notFoundError,
}));

vi.mock("../lib/rollbar/rollbar.tsx", () => ({
  reportHandledError: mocks.reportHandledError,
}));

vi.mock("./user-store.ts", () => ({
  userStore: {
    myId: 1,
    setUser: vi.fn(),
  },
}));

vi.mock("../lib/platform/platform.ts", () => ({
  platform: { haptic: vi.fn() },
}));

vi.mock("../lib/platform/show-confirm.ts", () => ({
  showConfirm: vi.fn(),
}));

describe("DeckListStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deckListStore.isStartParamHandled = false;
    screenStore.replace({ type: "main" });
    deckListStore.myInfoQuery.setData({
      user: {} as MyInfoResponse["user"],
      plan: null,
      myDecks: [],
      folders: [],
      cardsToReview: [],
      publicDecks: [
        {
          id: 42,
          name: "Travel English",
          authorId: 2,
          description: "Airport and hotel phrases",
          shareId: "travel",
          isPublic: true,
          speakLocale: null,
          speakField: null,
          deckCards: [],
          deckCategory: { name: "Travel", logo: "🇬🇧" },
        },
      ],
    });
  });

  it("preserves list-only category data when replacing public deck cards", () => {
    deckListStore.replaceDeck({
      id: 42,
      createdAt: "2026-01-01T00:00:00.000Z",
      name: "Travel English",
      authorId: 1,
      description: "Updated description",
      shareId: "travel",
      isPublic: true,
      speakLocale: null,
      speakField: null,
      availableIn: "en",
      categoryId: null,
      deckCards: [],
    });

    expect(deckListStore.myInfo?.publicDecks[0]).toMatchObject({
      description: "Updated description",
      deckCategory: { name: "Travel", logo: "🇬🇧" },
    });
    expect(deckDetailsStore.getQuery(42).data?.description).toBe(
      "Updated description",
    );
  });

  it("does not allow removing a public deck that has not been added", () => {
    expect(deckListStore.canRemoveDeck({ id: 42 })).toBe(false);
  });

  it("allows removing a non-owned deck after it has been added", () => {
    const publicDeck = deckListStore.myInfo?.publicDecks[0];
    expect(publicDeck).toBeDefined();
    deckListStore.myInfo?.myDecks.push(
      publicDeck as MyInfoResponse["myDecks"][number],
    );

    expect(deckListStore.canRemoveDeck({ id: 42 })).toBe(true);
  });

  it("allows folder removal only after it has been added", () => {
    expect(deckListStore.canRemoveFolder({ id: 7 })).toBe(false);

    deckListStore.myInfo?.folders.push({
      folder_id: 7,
      folder_title: "Travel",
      folder_description: null,
      folder_author_id: 2,
      folder_share_id: "travel-folder",
      folder_is_public: false,
      deck_id: null,
    });

    expect(deckListStore.canRemoveFolder({ id: 7 })).toBe(true);
  });

  it("shows the deleted deck screen for a missing share link", async () => {
    mocks.getByShareIdQuery.mockRejectedValueOnce(mocks.notFoundError);

    await deckListStore.handleStartParam("deleted");

    await vi.waitFor(() => {
      expect(screenStore.screen).toEqual({ type: "sharedDeckNotFound" });
    });
    expect(mocks.reportHandledError).not.toHaveBeenCalled();
  });
});
