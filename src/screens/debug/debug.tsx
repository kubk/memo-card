import { screenStore } from "../../store/screen-store.ts";
import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/platform/use-back-button.ts";

export const Debug = observer(() => {
  useBackButton(() => {
    screenStore.back();
  });

  return <div>Debug page</div>;
});
