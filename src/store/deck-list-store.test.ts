import { afterEach, describe, expect, test, vi } from "vitest";
import { deckListStore } from "./deck-list-store.ts";
import { MyInfoResponse } from "../../functions/my-info.ts";
import { when } from "mobx";

vi.mock("mobx-persist-store", () => {
  return {
    makePersistable: () => {},
  };
});

vi.mock("./user-store.ts", () => {
  return {
    userStore: {
      myId: 111,
      setUser: () => {},
    },
  };
});

vi.mock("../platform/storage-adapter.ts", () => {
  return {
    storageAdapter: {},
  };
});

vi.mock("../screens/shared/notify-payment.ts", () => {
  return {
    notifyPaymentFailed: () => {},
    notifyPaymentSuccess: () => {},
  };
});

vi.mock("../api/api.ts", () => {
  return {
    deckWithCardsRequest: () => {},
    getFolderWithDecksCards: () => {},
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
          is_admin: false,
          username: "test",
        },
        cardsToReview: [
          { id: 1, type: "new", deck_id: 1 },
          { id: 2, type: "repeat", deck_id: 1 },
          { id: 3, type: "new", deck_id: 1 },
          { id: 4, type: "new", deck_id: 2 },
          { id: 5, type: "repeat", deck_id: 1 },
        ],
        plans: [],
        myDecks: [
          {
            id: 1,
            created_at: "",
            available_in: null,
            name: "Deck 1",
            is_public: false,
            share_id: "1",
            author_id: 1,
            description: "",
            speak_locale: null,
            speak_field: null,
            category_id: null,
            deck_category: null,
            card_input_mode_id: null,
            deck_card: [
              {
                id: 1,
                created_at: "",
                deck_id: 1,
                front: "d1c1 - f",
                back: "d1c1 - b",
                answer_type: "remember",
                example: null,
                answers: null,
                options: null,
              },
              {
                id: 2,
                created_at: "",
                deck_id: 1,
                front: "d1c2 - f",
                back: "d1c2 - b",
                answer_type: "remember",
                example: null,
                answers: null,
                options: null,
              },
              {
                id: 3,
                created_at: "",
                deck_id: 1,
                front: "d1c3 - f",
                back: "d1c3 - b",
                answer_type: "remember",
                example: null,
                answers: null,
                options: null,
              },
              {
                id: 5,
                created_at: "",
                deck_id: 1,
                front: "d1c5 - f",
                back: "d1c5 - b",
                answer_type: "remember",
                example: null,
                answers: null,
                options: null,
              },
            ],
          },
          {
            id: 2,
            created_at: "",
            available_in: null,
            name: "Deck 2",
            is_public: false,
            share_id: "2",
            author_id: 1,
            description: "",
            speak_locale: null,
            speak_field: null,
            deck_category: null,
            category_id: null,
            card_input_mode_id: null,
            deck_card: [
              {
                id: 4,
                created_at: "",
                deck_id: 2,
                front: "d2c1 - f",
                back: "d2c1 - b",
                answer_type: "remember",
                example: null,
                answers: null,
                options: null,
              },
            ],
          },
        ],
        publicDecks: [],
        folders: [],
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

vi.mock("../lib/platform/telegram/haptics.ts", () => {
  return {
    hapticNotification: () => {},
    hapticImpact: () => {},
  };
});

vi.mock("../lib/platform/show-confirm.ts", () => {
  return {
    showConfirm: () => {
      return Promise.resolve(true);
    },
  };
});

vi.mock("../translations/t.ts", () => {
  return {
    t: (arg: any) => arg,
  };
});

vi.mock("../screens/shared/snackbar/snackbar.tsx", () => {
  return {
    notifySuccess: () => {},
    notifyError: () => {},
  };
});

describe("deck list store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("test load decks", async () => {
    deckListStore.load();

    await when(() => !!deckListStore.myInfo);

    expect(deckListStore.publicDecks).toHaveLength(0);
    expect(deckListStore.newCardsCount).toBe(3);
    expect(deckListStore.selectedDeck?.cardsToReview).toMatchInlineSnapshot(`
      [
        {
          "answer_type": "remember",
          "answers": null,
          "back": "d1c5 - b",
          "created_at": "",
          "deck_id": 1,
          "example": null,
          "front": "d1c5 - f",
          "id": 5,
          "options": null,
          "type": "repeat",
        },
        {
          "answer_type": "remember",
          "answers": null,
          "back": "d1c2 - b",
          "created_at": "",
          "deck_id": 1,
          "example": null,
          "front": "d1c2 - f",
          "id": 2,
          "options": null,
          "type": "repeat",
        },
        {
          "answer_type": "remember",
          "answers": null,
          "back": "d1c1 - b",
          "created_at": "",
          "deck_id": 1,
          "example": null,
          "front": "d1c1 - f",
          "id": 1,
          "options": null,
          "type": "new",
        },
        {
          "answer_type": "remember",
          "answers": null,
          "back": "d1c3 - b",
          "created_at": "",
          "deck_id": 1,
          "example": null,
          "front": "d1c3 - f",
          "id": 3,
          "options": null,
          "type": "new",
        },
      ]
    `);
  });
});
