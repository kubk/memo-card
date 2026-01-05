import { createContext, ReactNode, useContext, useState } from "react";
import { DeckFormStore } from "./deck-form-store.ts";
import { assert } from "api";
import { useMount } from "../../../../lib/react/use-mount.ts";

const Context = createContext<DeckFormStore | null>(null);

export function DeckFormStoreProvider(props: { children: ReactNode }) {
  const [store] = useState(() => new DeckFormStore());

  useMount(() => {
    store.loadForm();
  });

  return <Context.Provider value={store}>{props.children}</Context.Provider>;
}

export function useDeckFormStore() {
  const store = useContext(Context);
  assert(store, "DeckFormStoreProvider not found");
  return store;
}
