import { beforeEach, describe, expect, it, vi } from "vitest";
import { type RouterOutput } from "api";

type MyInfoResponse = RouterOutput["me"]["info"];
import { deckListStore } from "./deck-list-store.ts";

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
          authorId: 1,
          description: "Airport and hotel phrases",
          shareId: "travel",
          isPublic: true,
          speakLocale: null,
          speakField: null,
          speakAutoAi: false,
          reverseCards: false,
          cardInputModeId: null,
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
      speakAutoAi: false,
      reverseCards: false,
      cardInputModeId: null,
      availableIn: "en",
      categoryId: null,
      deckCards: [],
    });

    expect(deckListStore.myInfo?.publicDecks[0]).toMatchObject({
      description: "Updated description",
      deckCategory: { name: "Travel", logo: "🇬🇧" },
    });
  });
});
