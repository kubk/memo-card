import { createContext, ReactNode, useContext } from "react";
import { ReviewStore } from "./review-store.ts";
import { assert } from "api";
import { useMount } from "../../../lib/react/use-mount.ts";
import { loadHighQualityVoices } from "../../../lib/voice-playback/speak.ts";

const Context = createContext<ReviewStore | null>(null);

export const ReviewStoreProvider = (props: { children: ReactNode }) => {
  useMount(() => {
    loadHighQualityVoices();
  });

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
