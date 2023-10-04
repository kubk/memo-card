import React, { createContext, ReactNode, useContext } from "react";
import { assert } from "../lib/typescript/assert.ts";
import { DeckFormStore } from "./deck-form-store.ts";

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
  assert(store);
  return store;
};
