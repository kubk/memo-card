import { lazy, Suspense } from "react";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";

const FreezeCardsScreen = lazy(() =>
  import("./freeze-cards-screen.tsx").then((module) => ({
    default: module.FreezeCardsScreen,
  })),
);

export const FreezeCardsScreenLazy = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <FreezeCardsScreen />
    </Suspense>
  );
};
