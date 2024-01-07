import { createContext, ReactNode, useContext } from "react";
import { FolderFormStore } from "./folder-form-store.ts";
import { assert } from "../../../lib/typescript/assert.ts";

const Context = createContext<FolderFormStore | null>(null);

export const FolderFormStoreProvider = (props: { children: ReactNode }) => {
  return (
    <Context.Provider value={new FolderFormStore()}>
      {props.children}
    </Context.Provider>
  );
};

export const useFolderFormStore = () => {
  const store = useContext(Context);
  assert(store, "FolderFormStoreProvider not found");
  return store;
};
