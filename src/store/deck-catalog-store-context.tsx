import { assert } from "../lib/typescript/assert.ts";
import { DeckCatalogStore } from "./deck-catalog-store.ts";
import { createContext, ReactNode, useContext } from "react";

const Context = createContext<DeckCatalogStore | null>(null);

export const DeckCatalogStoreContextProvider = (props: {
  children: ReactNode;
}) => {
  return (
    <Context.Provider value={new DeckCatalogStore()}>
      {props.children}
    </Context.Provider>
  );
};

export const useDeckCatalogStore = () => {
  const store = useContext(Context);
  assert(store, "DeckCatalogStoreContextProvider not found");
  return store;
};
