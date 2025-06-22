import { makeAutoObservable } from "mobx";
import { RequestStore } from "../lib/mobx-request/request-store";
import { Feature } from "api";
import { api } from "../api/trpc-api";

class FeaturesStore {
  featuresRequest = new RequestStore(api.me.features.query);

  constructor() {
    makeAutoObservable(
      this,
      {
        isFeatureEnabled: false,
      },
      { autoBind: true },
    );
  }

  load() {
    this.featuresRequest.execute();
  }

  get features(): Feature[] {
    if (this.featuresRequest.result.status === "success") {
      return this.featuresRequest.result.data;
    }
    return [];
  }

  isFeatureEnabled(feature: Feature) {
    return this.features.includes(feature);
  }
}

export const featuresStore = new FeaturesStore();
