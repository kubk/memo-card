import { autorun } from "mobx";
import { UseMainButtonType } from "../platform.ts";
import { useEffect } from "preact/compat";
import { getWebApp } from "./telegram-web-app.ts";
import { overlayStore } from "../../../store/overlay-store.ts";

export const useMainButtonTelegram: UseMainButtonType = (
  text,
  onClick,
  condition,
  deps = [],
  options,
) => {
  const hideMainButton = () => {
    getWebApp().MainButton.hide();
    getWebApp().MainButton.offClick(onClick);
    getWebApp().MainButton.hideProgress();
  };

  useEffect(() => {
    const stopAutoRun = autorun(() => {
      if (
        overlayStore.isHidingMainButton(options?.isAboveBottomSheet) ||
        (condition !== undefined && !condition())
      ) {
        hideMainButton();
        return;
      }

      getWebApp().MainButton.show();
      getWebApp().MainButton.setText(typeof text === "string" ? text : text());
      getWebApp().MainButton.onClick(onClick);
      if (options?.hasShineEffect) {
        getWebApp().MainButton.hasShineEffect = true;
      }
    });

    return () => {
      stopAutoRun();
      hideMainButton();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
