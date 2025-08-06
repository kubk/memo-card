import { lazy, Suspense } from "react";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";

const Debug = lazy(() =>
  import("./debug.tsx").then((module) => ({
    default: module.Debug,
  })),
);

export function DebugLazy() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Debug />
    </Suspense>
  );
}
