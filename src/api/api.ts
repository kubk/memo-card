import { MyInfoResponse } from "../../functions/my-info.ts";
import { request } from "../lib/request/request.ts";
import { HealthResponse } from "../../functions/health.ts";
import {
  AddDeckToMineRequest,
  AddDeckToMineResponse,
} from "../../functions/add-deck-to-mine.ts";
import {
  ReviewCardsRequest,
  ReviewCardsResponse,
} from "../../functions/review-cards.ts";
import {
  UpsertDeckRequest,
  UpsertDeckResponse,
} from "../../functions/upsert-deck.ts";
import { GetSharedDeckResponse } from "../../functions/get-shared-deck.ts";
import { AddCardRequest, AddCardResponse } from "../../functions/add-card.ts";
import {
  UserSettingsRequest,
  UserSettingsResponse,
} from "../../functions/user-settings.ts";
import {
  RemoveDeckFromMineRequest,
  RemoveDeckFromMineResponse,
} from "../../functions/remove-deck-from-mine.ts";
import { DeckCatalogResponse } from "../../functions/catalog-decks.ts";
import { DeckWithCardsResponse } from "../../functions/deck-with-cards.ts";

export const healthRequest = () => {
  return request<HealthResponse>("/health");
};

export const myInfoRequest = () => {
  return request<MyInfoResponse>("/my-info");
};

export const getSharedDeckRequest = (shareId?: string) => {
  return request<GetSharedDeckResponse>(`/get-shared-deck?share_id=${shareId}`);
};

export const addDeckToMineRequest = (body: AddDeckToMineRequest) => {
  return request<AddDeckToMineResponse, AddDeckToMineRequest>(
    "/add-deck-to-mine",
    "POST",
    body,
  );
};

export const userSettingsRequest = (body: UserSettingsRequest) => {
  return request<UserSettingsResponse, UserSettingsRequest>(
    "/user-settings",
    "PUT",
    body,
  );
};

export const reviewCardsRequest = (body: ReviewCardsRequest) => {
  return request<ReviewCardsResponse, ReviewCardsRequest>(
    "/review-cards",
    "POST",
    body,
  );
};

export const upsertDeckRequest = (body: UpsertDeckRequest) => {
  return request<UpsertDeckResponse, UpsertDeckRequest>(
    "/upsert-deck",
    "POST",
    body,
  );
};

export const addCardRequest = (body: AddCardRequest) => {
  return request<AddCardResponse, AddCardRequest>("/add-card", "POST", body);
};

export const removeDeckFromMine = (body: RemoveDeckFromMineRequest) => {
  return request<RemoveDeckFromMineResponse, RemoveDeckFromMineRequest>(
    "/remove-deck-from-mine",
    "POST",
    body,
  );
};

export const apiDeckCatalog = () => {
  return request<DeckCatalogResponse>("/catalog-decks");
};

export const apiDeckWithCards = (deckId: number) => {
  return request<DeckWithCardsResponse>(`/deck-with-cards?deck_id=${deckId}`);
};
