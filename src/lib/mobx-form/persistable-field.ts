import { TextField } from "./mobx-form.ts";
import { makePersistable } from "mobx-persist-store";

export const persistableField = <T>(
  field: TextField<T>,
  storageKey: string,
): TextField<T> => {
  makePersistable(field, {
    name: storageKey,
    properties: ["value"],
    storage: window.localStorage,
    expireIn: 86400000, // One day in milliseconds
  });

  return field;
};
