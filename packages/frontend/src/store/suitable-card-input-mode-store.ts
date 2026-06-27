import { makeAutoObservable } from "mobx";
import { CardInputModeDb } from "api";
import { userStore } from "./user-store.ts";
import { LanguageShared } from "api";
import { makeQuery } from "../lib/mobx-query-lite/make-query.ts";
import { api } from "../api/trpc-api.ts";

class SuitableCardInputModeStore {
  cardInputModesQuery = makeQuery({
    key: "cardInputMode.list",
    query: api.cardInputMode.list.query,
  });

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get viewMode(): CardInputModeDb | null {
    if (!this.cardInputModesQuery.data) {
      return null;
    }

    const cardInputModes = this.cardInputModesQuery.data;
    const findByPreviewRecommendFor = (lang: LanguageShared) =>
      cardInputModes.find(
        (mode) => mode.options?.preview_recommend_for === lang,
      );

    const enInputMode = findByPreviewRecommendFor("en");
    const firstInputMode = cardInputModes[0];

    const defaultInputMode = enInputMode || firstInputMode;
    if (!defaultInputMode) {
      return null;
    }

    return findByPreviewRecommendFor(userStore.language) || defaultInputMode;
  }
}

export const suitableCardInputModeStore = new SuitableCardInputModeStore();
