import { createContext, ReactNode, useContext, useState } from "preact/compat";
import { FolderFormStore } from "./folder-form-store.ts";
import { assert } from "api";

const Context = createContext<FolderFormStore | null>(null);

export function FolderFormStoreProvider(props: { children: ReactNode }) {
  const [store] = useState(() => new FolderFormStore());
  return <Context.Provider value={store}>{props.children}</Context.Provider>;
}

export function useFolderFormStore() {
  const store = useContext(Context);
  assert(store, "FolderFormStoreProvider not found");
  return store;
}
