import { createContext, ReactNode, useContext } from "react";
import { FolderFormStore } from "./folder-form-store.ts";
import { assert } from "api";

const Context = createContext<FolderFormStore | null>(null);

export function FolderFormStoreProvider(props: { children: ReactNode }) {
  return (
    <Context.Provider value={new FolderFormStore()}>
      {props.children}
    </Context.Provider>
  );
}

export function useFolderFormStore() {
  const store = useContext(Context);
  assert(store, "FolderFormStoreProvider not found");
  return store;
}
