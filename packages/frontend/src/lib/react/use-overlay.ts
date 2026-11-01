import { useLayoutEffect } from "preact/compat";
import { overlayStore } from "../../store/overlay-store.ts";

export function useOverlay(isOpen = true) {
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }
    overlayStore.add();
    return () => overlayStore.remove();
  }, [isOpen]);
}
