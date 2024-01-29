import { makePersistable } from "mobx-persist-store";
import { FieldWithValue } from "./field-with-value.ts";
import { storageAdapter } from "../telegram/storage-adapter.ts";

export const persistableField = <T extends FieldWithValue<any>>(
  field: T,
  storageKey: string,
  expireIn?: number,
): T => {
  makePersistable(field, {
    name: storageKey,
    properties: ["value"],
    storage: storageAdapter,
    expireIn: expireIn,
  });

  return field;
};
