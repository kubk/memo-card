import { afterEach, describe, expect, test, vi } from "vitest";
import { onRequest as getSharedDeckRequest } from "./get-shared-deck.ts";
import { DeckWithCardsDbType } from "./db/deck/decks-with-cards-schema.ts";
import { createMockRequest } from "./lib/cloudflare/create-mock-request.ts";

vi.mock("./services/get-user.ts", () => ({
  getUser: async () => ({ id: 1 }),
}));

const getDeckAccessByShareIdMock = vi.hoisted(() => vi.fn());
vi.mock("./db/deck-access/get-deck-access-by-share-id-db.ts", () => ({
  getDeckAccessByShareIdDb: async () => getDeckAccessByShareIdMock(),
}));

const createJsonResponseMock = vi.hoisted(() => vi.fn());
vi.mock("./lib/json-response/create-json-response.ts", () => ({
  createJsonResponse: async () => createJsonResponseMock(),
}));

const getDeckWithCardsByIdMock = vi.hoisted(() => vi.fn());
vi.mock("./db/deck/get-deck-with-cards-by-id-db.ts", () => ({
  getDeckWithCardsById: async () => getDeckWithCardsByIdMock(),
}));

const getDeckWithCardsByShareIdDbMock = vi.hoisted(() => vi.fn());
vi.mock("./db/deck/get-deck-with-cards-by-share-id-db.ts", () => ({
  getDeckWithCardsByShareIdDb: async () => getDeckWithCardsByShareIdDbMock(),
}));

const createBadRequestResponseMock = vi.hoisted(() => vi.fn());
vi.mock("./lib/json-response/create-bad-request-response.ts", () => ({
  createBadRequestResponse: async () => createBadRequestResponseMock(),
}));

const startUsingDeckAccessDbMock = vi.hoisted(() => vi.fn());
vi.mock("./db/deck-access/start-using-deck-access-db.ts", () => ({
  startUsingDeckAccessDb: async () => startUsingDeckAccessDbMock(),
}));

const addDeckToMineDbMock = vi.hoisted(() => vi.fn());
vi.mock("./db/deck/add-deck-to-mine-db.ts", () => ({
  addDeckToMineDb: async () => addDeckToMineDbMock(),
}));

const mockDeckOfUser1: DeckWithCardsDbType = {
  id: 1,
  name: "name",
  description: "description",
  share_id: "share_id",
  author_id: 1,
  created_at: new Date().toISOString(),
  deck_category: null,
  deck_card: [],
  is_public: false,
  speak_field: null,
  available_in: null,
  category_id: null,
  speak_locale: null,
};

const mockDeckOfUser2: DeckWithCardsDbType = {
  id: 2,
  name: "name",
  description: "description",
  share_id: "share_id",
  author_id: 2,
  created_at: new Date().toISOString(),
  deck_category: null,
  deck_card: [],
  is_public: false,
  speak_field: null,
  available_in: null,
  category_id: null,
  speak_locale: null,
};

describe("get shared deck", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("deck author equals deck", async () => {
    getDeckAccessByShareIdMock.mockReturnValue({
      author_id: 1,
      used_by: null,
      deck_id: 1,
    });
    getDeckWithCardsByIdMock.mockReturnValue(mockDeckOfUser1);

    await getSharedDeckRequest(
      createMockRequest(`https://example.com?share_id=SHARE_ID1`),
    );

    expect(getDeckWithCardsByIdMock).toBeCalled();
    expect(getDeckWithCardsByShareIdDbMock).not.toBeCalled();
    expect(createBadRequestResponseMock).not.toBeCalled();
    expect(startUsingDeckAccessDbMock).not.toBeCalled();
  });

  test("no one time access found", async () => {
    getDeckAccessByShareIdMock.mockReturnValue(null);
    getDeckWithCardsByShareIdDbMock.mockReturnValue(mockDeckOfUser1);

    await getSharedDeckRequest(
      createMockRequest(`https://example.com?share_id=SHARE_ID1`),
    );

    expect(getDeckWithCardsByIdMock).not.toBeCalled();
    expect(getDeckWithCardsByShareIdDbMock).toBeCalled();
    expect(createBadRequestResponseMock).not.toBeCalled();
    expect(startUsingDeckAccessDbMock).not.toBeCalled();
  });

  test("one time access found, but already used by another user", async () => {
    getDeckAccessByShareIdMock.mockReturnValue({
      author_id: 2,
      used_by: 2,
      deck_id: 2,
    });
    getDeckWithCardsByIdMock.mockReturnValue(mockDeckOfUser2);

    await getSharedDeckRequest(
      createMockRequest(`https://example.com?share_id=SHARE_ID1`),
    );

    expect(createBadRequestResponseMock).toBeCalled();
  });

  test("one time access found and it is not used", async () => {
    getDeckAccessByShareIdMock.mockReturnValue({
      author_id: 2,
      used_by: null,
      deck_id: 2,
    });
    getDeckWithCardsByIdMock.mockReturnValue(mockDeckOfUser2);

    await getSharedDeckRequest(
      createMockRequest(`https://example.com?share_id=SHARE_ID1`),
    );

    expect(getDeckWithCardsByIdMock).toBeCalled();
    expect(startUsingDeckAccessDbMock).toBeCalled();
    expect(addDeckToMineDbMock).toBeCalled();
  });

  test("one time access found but it is already processed", async () => {
    getDeckAccessByShareIdMock.mockReturnValue({
      author_id: 2,
      used_by: null,
      deck_id: 2,
      processed_at: new Date().toISOString(),
    });
    getDeckWithCardsByIdMock.mockReturnValue(mockDeckOfUser2);

    await getSharedDeckRequest(
      createMockRequest(`https://example.com?share_id=SHARE_ID1`),
    );

    expect(createBadRequestResponseMock).toBeCalled();
  });
});
