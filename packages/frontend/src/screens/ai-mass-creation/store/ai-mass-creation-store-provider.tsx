import { createContext, ReactNode, useContext } from "react";
import { AiMassCreationStore } from "./ai-mass-creation-store.ts";
import { assert } from "api";

const Context = createContext<AiMassCreationStore | null>(null);

export const AiMassCreationStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <Context.Provider value={new AiMassCreationStore()}>
      {children}
    </Context.Provider>
  );
};

export const useAiMassCreationStore = () => {
  const store = useContext(Context);
  assert(store, "AiMassCreationStoreProvider should be defined");
  return store;
};
