import { createContext, ReactNode, useContext } from "react";
import { ShareDeckFormStore } from "./share-deck-form-store.ts";
import { DeckAccessType } from "api";
import { assert } from "api";

const Context = createContext<ShareDeckFormStore | null>(null);

type Props = {
  children: ReactNode;
  type: DeckAccessType;
};

export const ShareDeckOrFormStoreProvider = (props: Props) => {
  const { children, type } = props;
  return (
    <Context.Provider value={new ShareDeckFormStore(type)}>
      {children}
    </Context.Provider>
  );
};

export const useShareDeckStore = () => {
  const store = useContext(Context);
  assert(store, "ShareDeckStoreProvider not found");
  return store;
};
