import { createContext, ReactNode, useContext, useState } from "react";
import { DeckFormStore } from "./deck-form-store.ts";
import { assert } from "api";
import { useMount } from "../../../../lib/react/use-mount.ts";
import { type DeckListDeck } from "../../../../store/routing/route-types.ts";

const Context = createContext<DeckFormStore | null>(null);

type Props = {
  children: ReactNode;
  deck?: DeckListDeck;
};

export function DeckFormStoreProvider(props: Props) {
  const [store] = useState(() => new DeckFormStore());

  useMount(() => {
    store.loadForm(props.deck);
  });

  return <Context.Provider value={store}>{props.children}</Context.Provider>;
}

export function useDeckFormStore() {
  const store = useContext(Context);
  assert(store, "DeckFormStoreProvider not found");
  return store;
}
