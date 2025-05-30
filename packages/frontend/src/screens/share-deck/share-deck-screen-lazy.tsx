import { lazy, Suspense } from "react";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { ShareDeckOrFormStoreProvider } from "./store/share-deck-store-context.tsx";

const ShareDeckScreen = lazy(() =>
  import("./share-deck-screen.tsx").then((module) => ({
    default: module.ShareDeckScreen,
  })),
);

export const ShareDeckScreenLazy = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <ShareDeckOrFormStoreProvider type={"deck"}>
        <ShareDeckScreen />
      </ShareDeckOrFormStoreProvider>
    </Suspense>
  );
};

export const ShareFolderScreenLazy = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <ShareDeckOrFormStoreProvider type={"folder"}>
        <ShareDeckScreen />
      </ShareDeckOrFormStoreProvider>
    </Suspense>
  );
};
