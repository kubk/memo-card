import { RequestStore } from "../lib/mobx-request/request-store.ts";
import { cardInputModeListRequest } from "./api.ts";

export const createCachedCardInputModesRequest = () => {
  return new RequestStore(cardInputModeListRequest, {
    cacheId: "cardInputModeList",
  });
};
