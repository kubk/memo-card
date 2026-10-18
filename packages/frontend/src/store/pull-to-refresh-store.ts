import { refetchActiveQueries } from "../lib/mobx-query-lite/make-query.ts";
import { platform } from "../lib/platform/platform.ts";
import { TelegramPlatform } from "../lib/platform/telegram/telegram-platform.ts";
import { PullToRefreshStore } from "../lib/pull-to-refresh/pull-to-refresh-store.ts";
import { overlayStore } from "./overlay-store.ts";
import { screenStore } from "./screen-store.ts";

export const pullToRefreshStore = new PullToRefreshStore({
  refresh: refetchActiveQueries,
  isAvailable: () => {
    if (!platform.isMobile || overlayStore.isOpen) {
      return false;
    }

    // Older Telegram clients collapse the Mini App on a vertical swipe
    return !(
      platform instanceof TelegramPlatform && !platform.isSwipeControllable()
    );
  },
  getScreenKey: () => screenStore.screenEntryId,
  onThresholdReached: () => {
    platform.haptic("light");
  },
});
