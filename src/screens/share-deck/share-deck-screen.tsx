import { observer } from "mobx-react-lite";
import React from "react";
import { ShareDeckOneTimeLinks } from "./share-deck-one-time-links.tsx";
import { ShareDeckSettings } from "./share-deck-settings.tsx";
import { useShareDeckStore } from "./store/share-deck-store-context.tsx";

export const ShareDeckScreen = observer(() => {
  const store = useShareDeckStore();
  if (store.isDeckAccessesOpen.value) {
    return <ShareDeckOneTimeLinks />;
  }
  return <ShareDeckSettings />;
});
