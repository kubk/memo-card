import React, { createContext, ReactNode, useContext } from "react";
import { ReviewStore } from "./review-store.ts";
import { assert } from "../lib/typescript/assert.ts";

const Context = createContext<ReviewStore | null>(null);

export const ReviewStoreProvider = (props: { children: ReactNode }) => {
  return (
    <Context.Provider value={new ReviewStore()}>
      {props.children}
    </Context.Provider>
  );
};

export const useReviewStore = () => {
  const store = useContext(Context);
  assert(store, "ReviewStoreProvider not found");
  return store;
};
