import { request } from "./request.ts";
import { AddDeckToMineRequest, AddDeckToMineResponse } from "api";
import { ReviewCardsRequest, ReviewCardsResponse } from "api";
import { UpsertDeckRequest, UpsertDeckResponse } from "api";
import { GetSharedDeckResponse } from "api";
import { AddCardRequest, AddCardResponse } from "api";
import { UserSettingsRequest, UserSettingsResponse } from "api";
import { RemoveDeckFromMineRequest, RemoveDeckFromMineResponse } from "api";
import { DeckWithCardsResponse } from "api";
import { CopyDeckResponse } from "api";
import { AddFolderRequest, AddFolderResponse } from "api";
import { DeckAccessesResponse } from "api";
import { AddDeckAccessRequest, AddDeckAccessResponse } from "api";
import { DuplicateFolderResponse } from "api";
import { FolderWithDecksWithCardsResponse } from "api";
import { AddFolderToMineRequest } from "api";
import { CardsFreezeRequest, CardsFreezeResponse } from "api";
import { DeleteFolderResponse } from "api";
import {
  UpsertUserAiCredentialsRequest,
  UpsertUserAiCredentialsResponse,
} from "api";
import { AddCardsMultipleRequest, AddCardsMultipleResponse } from "api";
import { AiMassGenerateRequest, AiMassGenerateResponse } from "api";
import { AiSpeechGenerateRequest, AiSpeechGenerateResponse } from "api";
import { AiSingleCardRequest, AiSingleCardResponse } from "api";
import { CardInputModeChangeRequest, CardInputModeChangeResponse } from "api";
import { PlanDuration } from "api";
import { CatalogItemSettingsRequest, CatalogItemSettingsResponse } from "api";
import {
  UpdateCatalogItemSettingsRequest,
  UpdateCatalogItemSettingsResponse,
} from "api";
import { GoogleSignInRequest, GoogleSignInResponse } from "api";
import { DeleteMyselfResponse } from "api";
import { CreateOrderRequest, CreateOrderResponse } from "api";
import { api } from "./trpc-api.ts";

export const getSharedDeckRequest = (shareId?: string) => {
  return request<GetSharedDeckResponse>(`/get-shared-deck?share_id=${shareId}`);
};

export const getFolderWithDecksCards = (folderId?: number) => {
  return request<FolderWithDecksWithCardsResponse>(
    `/folder-with-decks-cards?folder_id=${folderId}`,
  );
};

export const catalogItemSettingsGetRequest = (
  query: CatalogItemSettingsRequest,
) => {
  const queryString = new URLSearchParams(query as any).toString();
  return request<CatalogItemSettingsResponse>(
    `/catalog-item-settings?${queryString}`,
  );
};

export const updateCatalogItemSettingsRequest = (
  body: UpdateCatalogItemSettingsRequest,
) => {
  return request<
    UpdateCatalogItemSettingsResponse,
    UpdateCatalogItemSettingsRequest
  >(`/update-catalog-item-settings`, "POST", body);
};

export const addDeckToMineRequest = (body: AddDeckToMineRequest) => {
  return request<AddDeckToMineResponse, AddDeckToMineRequest>(
    "/add-deck-to-mine",
    "POST",
    body,
  );
};

export const addFolderToMineRequest = (body: AddFolderToMineRequest) => {
  return request<AddFolderToMineRequest, AddFolderToMineRequest>(
    "/add-folder-to-mine",
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

export const deckWithCardsRequest = (deckId: number) => {
  return api["deck-with-cards"].query({ deck_id: deckId });
};

export const folderUpsertRequest = (body: AddFolderRequest) => {
  return request<AddFolderResponse, AddFolderRequest>(
    "/upsert-folder",
    "POST",
    body,
  );
};

export const deleteFolderRequest = (folderId: number) => {
  return request<DeleteFolderResponse>(
    `/delete-folder?folder_id=${folderId}`,
    "POST",
  );
};

export const starsOrderPlanRequest = (
  planId: number,
  duration: PlanDuration,
) => {
  return request<CreateOrderResponse, CreateOrderRequest>(
    `/stars-order-plan`,
    "POST",
    {
      planId,
      duration: duration.toString(),
    },
  );
};

export const cardsFreezeRequest = (body: CardsFreezeRequest) => {
  return request<CardsFreezeResponse, CardsFreezeRequest>(
    "/cards-freeze",
    "POST",
    body,
  );
};

export const aiMassGenerateRequest = (body: AiMassGenerateRequest) => {
  return request<AiMassGenerateResponse, AiMassGenerateRequest>(
    "/ai-mass-generate",
    "POST",
    body,
  );
};

export const upsertUserAiCredentialsRequest = (
  body: UpsertUserAiCredentialsRequest,
) => {
  return request<
    UpsertUserAiCredentialsResponse,
    UpsertUserAiCredentialsRequest
  >("/upsert-user-ai-credentials", "POST", body);
};

export const addCardsMultipleRequest = (body: AddCardsMultipleRequest) => {
  return request<AddCardsMultipleResponse, AddCardsMultipleRequest>(
    "/add-cards-multiple",
    "POST",
    body,
  );
};

export const aiSpeechGenerateRequest = (body: AiSpeechGenerateRequest) => {
  return request<AiSpeechGenerateResponse, AiSpeechGenerateRequest>(
    "/ai-speech-generate",
    "POST",
    body,
  );
};

export const aiSingleCardGenerateRequest = (body: AiSingleCardRequest) => {
  return request<AiSingleCardResponse, AiSingleCardRequest>(
    "/ai-single-card-generate",
    "POST",
    body,
  );
};

export const deckChangeInputModeRequest = (
  body: CardInputModeChangeRequest,
) => {
  return request<CardInputModeChangeResponse, CardInputModeChangeRequest>(
    "/card-input-mode-change",
    "PUT",
    body,
  );
};

export const googleSignInRequest = (input: GoogleSignInRequest) => {
  return request<GoogleSignInResponse, GoogleSignInRequest>(
    "/google-signin",
    "POST",
    input,
  );
};

export const deleteAccountRequest = () => {
  return request<DeleteMyselfResponse>("/delete-account", "POST");
};
