import { type ComponentPropsWithoutRef, lazy, Suspense } from "react";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";
import type * as DrawerComponents from "./drawer-impl.tsx";

const drawerPromise = import("./drawer-impl.tsx").then((module) => ({
  default: module.Drawer,
}));

drawerPromise.catch((error) => {
  reportHandledError("Failed to preload drawer", error);
});

const LazyDrawer = lazy(() => drawerPromise);

export function Drawer(
  props: ComponentPropsWithoutRef<typeof DrawerComponents.Drawer>,
) {
  return (
    <Suspense fallback={null}>
      <LazyDrawer {...props} />
    </Suspense>
  );
}
