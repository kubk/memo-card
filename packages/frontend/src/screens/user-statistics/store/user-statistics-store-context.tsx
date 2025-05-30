import { createContext, ReactNode, useContext } from "react";
import { UserStatisticsStore } from "./user-statistics-store.ts";
import { assert } from "api";

const Context = createContext<UserStatisticsStore | null>(null);

export const UserStatisticsStoreProvider = (props: { children: ReactNode }) => {
  return (
    <Context.Provider value={new UserStatisticsStore()}>
      {props.children}
    </Context.Provider>
  );
};

export const useUserStatisticsStore = () => {
  const store = useContext(Context);
  assert(store, "UserStatisticsStoreProvider not found");
  return store;
};
