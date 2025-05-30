import { RequestStore } from "../lib/mobx-request/request-store.ts";
import { deckCategoriesRequest } from "./api.ts";

export const createCachedCategoriesRequest = () => {
  return new RequestStore(deckCategoriesRequest, {
    cacheId: "categoriesRequest",
  });
};
