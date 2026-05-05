import { createContext, ReactNode, useContext, useState } from "react";
import { UserStatisticsStore } from "./user-statistics-store.ts";
import { assert } from "api";

const Context = createContext<UserStatisticsStore | null>(null);

export const UserStatisticsStoreProvider = (props: { children: ReactNode }) => {
  const [store] = useState(() => new UserStatisticsStore());

  return <Context.Provider value={store}>{props.children}</Context.Provider>;
};

export const useUserStatisticsStore = () => {
  const store = useContext(Context);
  assert(store, "UserStatisticsStoreProvider not found");
  return store;
};
