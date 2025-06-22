import { RequestStore } from "../lib/mobx-request/request-store.ts";
import { api } from "./trpc-api.ts";

export const createCachedCategoriesRequest = () => {
  return new RequestStore(api.catalog.deckCategories.query, {
    cacheId: "categoriesRequest",
  });
};
