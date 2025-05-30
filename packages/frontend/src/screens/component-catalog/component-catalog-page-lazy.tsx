import { lazy, Suspense } from "react";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";

const ComponentCatalogPage = lazy(() =>
  import("./component-catalog-page.tsx").then((module) => ({
    default: module.ComponentCatalogPage,
  })),
);

export const ComponentCatalogPageLazy = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <ComponentCatalogPage />
    </Suspense>
  );
};
