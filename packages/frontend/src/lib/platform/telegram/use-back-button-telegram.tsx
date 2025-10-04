import { UseBackButtonType } from "../platform.ts";
import { useEffect } from "react";
import { getWebAppOrNull } from "./telegram-web-app.ts";

export const useBackButtonTelegram: UseBackButtonType = (
  fn: () => void,
  deps = [],
) => {
  useEffect(() => {
    const webApp = getWebAppOrNull();
    if (!webApp) {
      return;
    }
    webApp.BackButton.show();
    webApp.BackButton.onClick(fn);

    return () => {
      webApp.BackButton.offClick(fn);
      webApp.BackButton.hide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
