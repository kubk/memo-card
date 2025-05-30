import { UseBackButtonType } from "../platform.ts";
import { useEffect } from "react";
import { getWebApp } from "./telegram-web-app.ts";

export const useBackButtonTelegram: UseBackButtonType = (
  fn: () => void,
  deps = [],
) => {
  useEffect(() => {
    getWebApp().BackButton.show();
    getWebApp().BackButton.onClick(fn);

    return () => {
      getWebApp().BackButton.offClick(fn);
      getWebApp().BackButton.hide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
