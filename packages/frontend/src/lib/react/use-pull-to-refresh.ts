import { pullToRefreshStore } from "../../store/pull-to-refresh-store.ts";
import { useMount } from "./use-mount.ts";

export function usePullToRefresh(isEnabled?: () => boolean) {
  useMount(() => pullToRefreshStore.enable(isEnabled));
}
