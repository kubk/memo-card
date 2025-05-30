import { createContext, ReactNode, useContext } from "react";
import { DeckFormStore } from "./deck-form-store.ts";
import { assert } from "api";

const Context = createContext<DeckFormStore | null>(null);

export const DeckFormStoreProvider = (props: { children: ReactNode }) => {
  return (
    <Context.Provider value={new DeckFormStore()}>
      {props.children}
    </Context.Provider>
  );
};

export const useDeckFormStore = () => {
  const store = useContext(Context);
  assert(store, "DeckFormStoreProvider not found");
  return store;
};
