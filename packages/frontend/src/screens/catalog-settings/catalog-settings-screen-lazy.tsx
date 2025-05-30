import { lazy, Suspense } from "react";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";

const CatalogSettings = lazy(() =>
  import("./catalog-settings-screen.tsx").then((module) => ({
    default: module.CatalogSettingsScreen,
  })),
);

export function CatalogSettingsScreenLazy() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <CatalogSettings />
    </Suspense>
  );
}
