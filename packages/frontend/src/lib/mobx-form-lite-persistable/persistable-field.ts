import { makePersistable } from "mobx-persist-store";
import { getStorageAdapter } from "../platform/storage-adapter.ts";
import { FieldWithValue } from "mobx-form-lite";

export const persistableField = <T extends FieldWithValue<unknown>>(
  field: T,
  storageKey: string,
  expireIn?: number,
): T => {
  makePersistable(field, {
    name: storageKey,
    properties: ["value"],
    storage: getStorageAdapter(),
    expireIn: expireIn,
  });

  return field;
};
