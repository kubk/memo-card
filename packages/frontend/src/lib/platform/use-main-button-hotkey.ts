import { useHotkeys } from "react-hotkeys-hook";
import { overlayStore } from "../../store/overlay-store.ts";

export function useMainButtonHotkey(
  onClick: () => void,
  condition?: () => boolean,
  isAboveBottomSheet?: boolean,
) {
  useHotkeys("enter", () => {
    if (overlayStore.isHidingMainButton(isAboveBottomSheet)) {
      return;
    }

    if (condition !== undefined && !condition()) {
      return;
    }

    onClick();
  });
}
