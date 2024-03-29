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
import { CopyDeckResponse } from "../../functions/duplicate-deck.ts";
import { DeckCategoryResponse } from "../../functions/deck-categories.ts";
import {
  AddFolderRequest,
  AddFolderResponse,
} from "../../functions/upsert-folder.ts";
import { DeckAccessesResponse } from "../../functions/deck-accesses.ts";
import {
  AddDeckAccessRequest,
  AddDeckAccessResponse,
} from "../../functions/add-deck-access.ts";
import { DecksMineResponse } from "../../functions/decks-mine.ts";
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from "../../functions/order-plan.ts";
import { DuplicateFolderResponse } from "../../functions/duplicate-folder.ts";
import { MyStatisticsResponse } from "../../functions/my-statistics.ts";
import { AllPlansResponse } from "../../functions/plans.ts";

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

export const getDeckAccessesOfDeckRequest = (
  filters: { deckId: string } | { folderId: string },
) => {
  const queryParams = new URLSearchParams(filters).toString();
  return request<DeckAccessesResponse>(`/deck-accesses?${queryParams}`);
};

export const addDeckAccessRequest = (body: AddDeckAccessRequest) => {
  return request<AddDeckAccessResponse, AddDeckAccessRequest>(
    "/add-deck-access",
    "POST",
    body,
  );
};

export const duplicateDeckRequest = (deckId: number) => {
  return request<CopyDeckResponse>(`/duplicate-deck?deck_id=${deckId}`, "POST");
};

export const duplicateFolderRequest = (folderId: number) => {
  return request<DuplicateFolderResponse>(
    `/duplicate-folder?folder_id=${folderId}`,
    "POST",
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

export const removeDeckFromMineRequest = (body: RemoveDeckFromMineRequest) => {
  return request<RemoveDeckFromMineResponse, RemoveDeckFromMineRequest>(
    "/remove-deck-from-mine",
    "POST",
    body,
  );
};

export const deckCatalogRequest = () => {
  return request<DeckCatalogResponse>("/catalog-decks");
};

export const deckWithCardsRequest = (deckId: number) => {
  return request<DeckWithCardsResponse>(`/deck-with-cards?deck_id=${deckId}`);
};

export const deckCategoriesRequest = () => {
  return request<DeckCategoryResponse>("/deck-categories");
};

export const folderUpsertRequest = (body: AddFolderRequest) => {
  return request<AddFolderResponse, AddFolderRequest>(
    "/upsert-folder",
    "POST",
    body,
  );
};

export const deleteFolderRequest = (folderId: number) => {
  return request<null>(`/delete-folder?folder_id=${folderId}`, "POST");
};

export const decksMineRequest = () => {
  return request<DecksMineResponse>("/decks-mine");
};

export const createOrderRequest = (planId: number) => {
  return request<CreateOrderResponse, CreateOrderRequest>(
    `/order-plan`,
    "POST",
    {
      planId,
    },
  );
};

export const allPlansRequest = () => {
  return request<AllPlansResponse>("/plans");
};

export const myStatisticsRequest = () => {
  return request<MyStatisticsResponse>("/my-statistics");
};
