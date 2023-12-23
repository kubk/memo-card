import { TextField } from "./mobx-form.ts";
import { makePersistable } from "mobx-persist-store";

export const persistableField = <T>(
  field: TextField<T>,
  storageKey: string,
  expireIn?: number,
): TextField<T> => {
  makePersistable(field, {
    name: storageKey,
    properties: ["value"],
    storage: window.localStorage,
    expireIn: expireIn,
  });

  return field;
};
