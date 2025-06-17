import { AddDeckToMineRequest } from "api";
import { ReviewCardsRequest } from "api";
import { UpsertDeckRequest } from "api";
import { AddCardRequest } from "api";
import { UserSettingsRequest } from "api";
import { RemoveDeckFromMineRequest } from "api";
import { AddFolderRequest } from "api";
import { AddFolderToMineRequest } from "api";
import { CardsFreezeRequest } from "api";
import { AddCardsMultipleRequest } from "api";
import { AiMassGenerateRequest } from "api";
import { AiSpeechGenerateRequest } from "api";
import { AiSingleCardRequest } from "api";
import { CardInputModeChangeRequest } from "api";
import { PlanDuration } from "api";
import { CatalogItemSettingsRequest } from "api";
import { UpdateCatalogItemSettingsRequest } from "api";
import { GoogleSignInRequest } from "api";
import { api } from "./trpc-api.ts";

export const getSharedDeckRequest = (shareId: string) => {
  return api["get-shared-deck"].query({ share_id: shareId });
};

export const getFolderWithDecksCards = (folderId: number) => {
  return api["folder-with-decks-cards"].query({ folder_id: folderId });
};

export const catalogItemSettingsGetRequest = (
  query: CatalogItemSettingsRequest,
) => {
  return api["catalog-item-settings"].query(query);
};

export const updateCatalogItemSettingsRequest = (
  body: UpdateCatalogItemSettingsRequest,
) => {
  return api["update-catalog-item-settings"].mutate(body);
};

export const addDeckToMineRequest = (body: AddDeckToMineRequest) => {
  return api["add-deck-to-mine"].mutate(body);
};

export const addFolderToMineRequest = (body: AddFolderToMineRequest) => {
  return api["add-folder-to-mine"].mutate(body);
};

export const duplicateDeckRequest = (deckId: number) => {
  return api["duplicate-deck"].mutate({ deck_id: deckId });
};

export const duplicateFolderRequest = (folderId: number) => {
  return api["duplicate-folder"].mutate({ folder_id: folderId });
};

export const userSettingsRequest = (body: UserSettingsRequest) => {
  return api["user-settings"].mutate(body);
};

export const reviewCardsRequest = (body: ReviewCardsRequest) => {
  return api["review-cards"].mutate(body);
};

export const upsertDeckRequest = (body: UpsertDeckRequest) => {
  return api["upsert-deck"].mutate(body);
};

export const addCardRequest = (body: AddCardRequest) => {
  return api["add-card"].mutate(body);
};

export const removeDeckFromMineRequest = (body: RemoveDeckFromMineRequest) => {
  return api["remove-deck-from-mine"].mutate(body);
};

export const deckWithCardsRequest = (deckId: number) => {
  return api["deck-with-cards"].query({ deck_id: deckId });
};

export const folderUpsertRequest = (body: AddFolderRequest) => {
  return api["upsert-folder"].mutate(body);
};

export const deleteFolderRequest = (folderId: number) => {
  return api["delete-folder"].mutate({ folder_id: folderId });
};

export const starsOrderPlanRequest = (
  planId: number,
  duration: PlanDuration,
) => {
  return api["stars-order-plan"].mutate({
    planId,
    duration: duration.toString(),
  });
};

export const cardsFreezeRequest = (body: CardsFreezeRequest) => {
  return api["cards-freeze"].mutate(body);
};

export const aiMassGenerateRequest = (body: AiMassGenerateRequest) => {
  return api["ai-mass-generate"].mutate(body);
};

export const addCardsMultipleRequest = (body: AddCardsMultipleRequest) => {
  return api["add-cards-multiple"].mutate(body);
};

export const aiSpeechGenerateRequest = (body: AiSpeechGenerateRequest) => {
  return api["ai-speech-generate"].mutate(body);
};

export const aiSingleCardGenerateRequest = (body: AiSingleCardRequest) => {
  return api["ai-single-card-generate"].mutate(body);
};

export const deckChangeInputModeRequest = (
  body: CardInputModeChangeRequest,
) => {
  return api["card-input-mode-change"].mutate(body);
};

export const googleSignInRequest = (input: GoogleSignInRequest) => {
  return api["google-signin"].mutate(input);
};

export const deleteAccountRequest = () => {
  return api["delete-account"].mutate();
};
