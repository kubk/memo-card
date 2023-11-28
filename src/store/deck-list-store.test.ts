import { afterEach, describe, expect, test, vi } from "vitest";
import { deckListStore } from "./deck-list-store.ts";
import { MyInfoResponse } from "../../functions/my-info.ts";
import { when } from "mobx";

vi.mock("../api/api.ts", () => {
  return {
    reviewCardsRequest: () => {},
    myInfoRequest: (): Promise<MyInfoResponse> => {
      return Promise.resolve({
        user: {
          id: 111,
          first_name: "Test",
          is_remind_enabled: true,
          language_code: "uk",
          last_name: "Testov",
          last_reminded_date: null,
          is_speaking_card_enabled: false,
          username: "test",
        },
        cardsToReview: [
          { id: 1, type: "new", deck_id: 1 },
          { id: 2, type: "repeat", deck_id: 1 },
          { id: 3, type: "new", deck_id: 1 },
          { id: 4, type: "new", deck_id: 2 },
          { id: 5, type: "repeat", deck_id: 1 },
        ],
        myDecks: [
          {
            id: 1,
            created_at: "",
            name: "Deck 1",
            is_public: false,
            share_id: "1",
            author_id: 1,
            description: "",
            speak_locale: null,
            speak_field: null,
            deck_card: [
              {
                id: 1,
                created_at: "",
                deck_id: 1,
                front: "d1c1 - f",
                back: "d1c1 - b",
                example: null,
              },
              {
                id: 2,
                created_at: "",
                deck_id: 1,
                front: "d1c2 - f",
                back: "d1c2 - b",
                example: null,
              },
              {
                id: 3,
                created_at: "",
                deck_id: 1,
                front: "d1c3 - f",
                back: "d1c3 - b",
                example: null,
              },
              {
                id: 5,
                created_at: "",
                deck_id: 1,
                front: "d1c5 - f",
                back: "d1c5 - b",
                example: null,
              },
            ],
          },
          {
            id: 2,
            created_at: "",
            name: "Deck 2",
            is_public: false,
            share_id: "2",
            author_id: 1,
            description: "",
            speak_locale: null,
            speak_field: null,
            deck_card: [
              {
                id: 4,
                created_at: "",
                deck_id: 2,
                front: "d2c1 - f",
                back: "d2c1 - b",
                example: null,
              },
            ],
          },
        ],
        publicDecks: [],
      });
    },
    addDeckToMineRequest: () => {},
    getSharedDeckRequest: () => {},
  };
});

vi.mock("./screen-store", () => {
  return {
    screenStore: {
      screen: {
        type: "deckMine",
        deckId: 1,
      },
    },
  };
});

describe("deck list store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("test 1", async () => {
    deckListStore.load();

    await when(() => deckListStore.myInfo?.state === "fulfilled");

    expect(deckListStore.myId).toBe(111);
    expect(deckListStore.publicDecks).toHaveLength(0);
    expect(deckListStore.selectedDeck?.cardsToReview).toMatchInlineSnapshot(`
      [
        {
          "back": "d1c5 - b",
          "created_at": "",
          "deck_id": 1,
          "example": null,
          "front": "d1c5 - f",
          "id": 5,
          "type": "repeat",
        },
        {
          "back": "d1c2 - b",
          "created_at": "",
          "deck_id": 1,
          "example": null,
          "front": "d1c2 - f",
          "id": 2,
          "type": "repeat",
        },
        {
          "back": "d1c1 - b",
          "created_at": "",
          "deck_id": 1,
          "example": null,
          "front": "d1c1 - f",
          "id": 1,
          "type": "new",
        },
        {
          "back": "d1c3 - b",
          "created_at": "",
          "deck_id": 1,
          "example": null,
          "front": "d1c3 - f",
          "id": 3,
          "type": "new",
        },
      ]
    `);
  });
});
