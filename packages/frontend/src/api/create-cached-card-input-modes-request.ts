import { RequestStore } from "../lib/mobx-request/request-store.ts";
import { api } from "./trpc-api.ts";

export const createCachedCardInputModesRequest = () => {
  return new RequestStore(api.cardInputMode.list.query, {
    cacheId: "cardInputModeList",
  });
};
