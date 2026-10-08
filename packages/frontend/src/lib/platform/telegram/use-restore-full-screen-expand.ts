import { useEffect } from "preact/compat";
import { platform } from "../platform.ts";
import { TelegramPlatform } from "./telegram-platform.ts";
import { getWebApp } from "./telegram-web-app.ts";

export const useRestoreFullScreenExpand = () => {
  useEffect(() => {
    if (!(platform instanceof TelegramPlatform)) {
      return;
    }

    if (!platform.isMobile) {
      return;
    }

    const onViewPortChanged = () => {
      getWebApp().expand();
    };
    getWebApp().onEvent("viewportChanged", onViewPortChanged);

    return () => {
      getWebApp().offEvent("viewportChanged", onViewPortChanged);
    };
  }, []);
};
