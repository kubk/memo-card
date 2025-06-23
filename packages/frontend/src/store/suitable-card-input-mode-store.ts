import { createCachedCardInputModesRequest } from "../api/create-cached-card-input-modes-request.ts";
import { makeAutoObservable } from "mobx";
import { CardInputModeDb } from "api";
import { userStore } from "./user-store.ts";
import { LanguageShared } from "api";

export class SuitableCardInputModeStore {
  cardInputModesRequest = createCachedCardInputModesRequest();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.cardInputModesRequest.execute();
  }

  get viewMode(): CardInputModeDb | null {
    if (this.cardInputModesRequest.result.status !== "success") {
      return null;
    }

    const cardInputModes = this.cardInputModesRequest.result.data;
    const findByPreviewRecommendFor = (lang: LanguageShared) =>
      cardInputModes.find(
        (mode) => mode.options?.preview_recommend_for === lang,
      );

    const enInputMode = findByPreviewRecommendFor("en");
    const firstInputMode = this.cardInputModesRequest.result.data[0];

    const defaultInputMode = enInputMode || firstInputMode;
    if (!defaultInputMode) {
      return null;
    }

    return findByPreviewRecommendFor(userStore.language) || defaultInputMode;
  }
}

export const suitableCardInputModeStore = new SuitableCardInputModeStore();
