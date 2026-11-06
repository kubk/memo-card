import { createContext, ReactNode, useContext, useState } from "preact/compat";
import { UserSettingsStore } from "./user-settings-store.tsx";
import { assert } from "api";

const Context = createContext<UserSettingsStore | null>(null);

export const UserSettingsStoreProvider = (props: { children: ReactNode }) => {
  const [store] = useState(() => new UserSettingsStore());
  return <Context.Provider value={store}>{props.children}</Context.Provider>;
};

export const useUserSettingsStore = () => {
  const store = useContext(Context);
  assert(store, "UserSettingsStoreProvider not found");
  return store;
};
