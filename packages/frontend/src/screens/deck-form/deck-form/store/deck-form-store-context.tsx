import { createContext, ReactNode, useContext, useState } from "preact/compat";
import { DeckFormStore } from "./deck-form-store.ts";
import { assert } from "api";
import { useMount } from "../../../../lib/react/use-mount.ts";
import { screenStore } from "../../../../store/screen-store.ts";
import { DeckWithCardsGate } from "../../deck-with-cards-gate.tsx";

const Context = createContext<DeckFormStore | null>(null);

function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new DeckFormStore());

  useMount(() => {
    store.loadForm();
  });

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function DeckFormStoreProvider({ children }: { children: ReactNode }) {
  const screen = screenStore.screen;
  const deckId =
    screen.type === "deckForm" || screen.type === "speakingCards"
      ? screen.deckId
      : undefined;

  return (
    <DeckWithCardsGate deckId={deckId}>
      <StoreProvider>{children}</StoreProvider>
    </DeckWithCardsGate>
  );
}

export function useDeckFormStore() {
  const store = useContext(Context);
  assert(store, "DeckFormStoreProvider not found");
  return store;
}
