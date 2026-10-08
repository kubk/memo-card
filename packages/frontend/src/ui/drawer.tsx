import { type ComponentProps, lazy, Suspense } from "preact/compat";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";
import type * as DrawerComponents from "./drawer-impl.tsx";

const drawerPromise = import("./drawer-impl.tsx").then((module) => ({
  default: module.Drawer,
}));

drawerPromise.catch((error) => {
  reportHandledError("Failed to preload drawer", error);
});

const LazyDrawer = lazy(() => drawerPromise);

export function Drawer(props: ComponentProps<typeof DrawerComponents.Drawer>) {
  return (
    <Suspense fallback={null}>
      <LazyDrawer {...props} />
    </Suspense>
  );
}
