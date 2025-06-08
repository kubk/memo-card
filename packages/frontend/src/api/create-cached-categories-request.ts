import { RequestStore } from "../lib/mobx-request/request-store.ts";
import { api } from "./trpc-api.ts";

export const createCachedCategoriesRequest = () => {
  return new RequestStore(api["deck-categories"].query, {
    cacheId: "categoriesRequest",
  });
};
