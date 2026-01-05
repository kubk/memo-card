import { createContext, ReactNode, useContext, useState } from "react";
import { CardFormStore } from "./card-form-store.ts";
import { assert } from "api";
import { useMount } from "../../../../lib/react/use-mount.ts";

const Context = createContext<CardFormStore | null>(null);

export function CardFormStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new CardFormStore());

  useMount(() => {
    store.loadForm();
  });

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useCardFormStore() {
  const store = useContext(Context);
  assert(store, "CardFormStoreProvider should be defined");
  return store;
}
