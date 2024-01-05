import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { ShareDeckStore } from "./store/share-deck-store.ts";
import { ShareDeckOneTimeLinks } from "./share-deck-one-time-links.tsx";
import { ShareDeckSettings } from "./share-deck-settings.tsx";

export const ShareDeckScreen = observer(() => {
  const [store] = useState(() => new ShareDeckStore());

  if (store.isDeckAccessesOpen.value) {
    return <ShareDeckOneTimeLinks store={store} />;
  }
  return <ShareDeckSettings store={store} />;
});
