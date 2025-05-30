import { createContext, ReactNode, useContext } from "react";
import { UserSettingsStore } from "./user-settings-store.tsx";
import { assert } from "api";

const Context = createContext<UserSettingsStore | null>(null);

export const UserSettingsStoreProvider = (props: { children: ReactNode }) => {
  return (
    <Context.Provider value={new UserSettingsStore()}>
      {props.children}
    </Context.Provider>
  );
};

export const useUserSettingsStore = () => {
  const store = useContext(Context);
  assert(store, "UserSettingsStoreProvider not found");
  return store;
};
