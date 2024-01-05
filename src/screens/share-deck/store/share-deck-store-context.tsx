import { createContext, ReactNode, useContext } from "react";
import { ShareDeckStore } from "./share-deck-store.ts";
import { assert } from "../../../lib/typescript/assert.ts";

const Context = createContext<ShareDeckStore | null>(null);

export const ShareDeckStoreProvider = (props: { children: ReactNode }) => {
  return (
    <Context.Provider value={new ShareDeckStore()}>
      {props.children}
    </Context.Provider>
  );
};

export const useShareDeckStore = () => {
  const store = useContext(Context);
  assert(store, "ShareDeckStoreProvider not found");
  return store;
};
