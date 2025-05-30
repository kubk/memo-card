import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";

export function Debug() {
  useBackButton(() => {
    screenStore.back();
  });

  return <div>Debug</div>;
}
