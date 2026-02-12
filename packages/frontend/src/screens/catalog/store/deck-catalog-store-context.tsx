import { assert } from "api";
import { DeckCatalogStore } from "./deck-catalog-store.ts";
import { createContext, ReactNode, useContext, useState } from "react";

const Context = createContext<DeckCatalogStore | null>(null);

export const DeckCatalogStoreContextProvider = (props: {
  children: ReactNode;
}) => {
  const [store] = useState(() => new DeckCatalogStore());
  return (
    <Context.Provider value={store}>
      {props.children}
    </Context.Provider>
  );
};

export const useDeckCatalogStore = () => {
  const store = useContext(Context);
  assert(store, "DeckCatalogStoreContextProvider not found");
  return store;
};
