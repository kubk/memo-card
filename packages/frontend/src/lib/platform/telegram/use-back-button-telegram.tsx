import { UseBackButtonType } from "../platform.ts";
import { useEffect } from "react";
import { getWebAppOrNull } from "./telegram-web-app.ts";

let registrationId = 0;
let activeBackButtonEntries: {
  id: number;
  onBack: () => void;
}[] = [];
let activeWebApp: ReturnType<typeof getWebAppOrNull> = null;
let hideTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isTelegramListenerAttached = false;

function clearScheduledHide() {
  if (hideTimeoutId === null) {
    return;
  }

  clearTimeout(hideTimeoutId);
  hideTimeoutId = null;
}

function handleTelegramBackButtonClick() {
  const entry = activeBackButtonEntries[activeBackButtonEntries.length - 1];
  entry?.onBack();
}

function ensureTelegramBackButtonVisible(
  webApp: NonNullable<ReturnType<typeof getWebAppOrNull>>,
) {
  clearScheduledHide();

  if (activeWebApp && activeWebApp !== webApp && isTelegramListenerAttached) {
    activeWebApp.BackButton.offClick(handleTelegramBackButtonClick);
    isTelegramListenerAttached = false;
  }

  activeWebApp = webApp;
  if (!isTelegramListenerAttached) {
    webApp.BackButton.onClick(handleTelegramBackButtonClick);
    isTelegramListenerAttached = true;
  }
  webApp.BackButton.show();
}

function scheduleTelegramBackButtonHide(
  webApp: NonNullable<ReturnType<typeof getWebAppOrNull>>,
) {
  clearScheduledHide();

  hideTimeoutId = setTimeout(() => {
    hideTimeoutId = null;
    if (activeBackButtonEntries.length > 0) {
      return;
    }

    if (isTelegramListenerAttached) {
      webApp.BackButton.offClick(handleTelegramBackButtonClick);
      isTelegramListenerAttached = false;
    }
    webApp.BackButton.hide();
    if (activeWebApp === webApp) {
      activeWebApp = null;
    }
  }, 0);
}

export const useBackButtonTelegram: UseBackButtonType = (
  fn: () => void,
  deps = [],
) => {
  useEffect(() => {
    const webApp = getWebAppOrNull();
    if (!webApp) {
      return;
    }
    const id = ++registrationId;
    const entry = { id, onBack: fn };

    activeBackButtonEntries.push(entry);
    ensureTelegramBackButtonVisible(webApp);

    return () => {
      activeBackButtonEntries = activeBackButtonEntries.filter(
        (item) => item.id !== id,
      );
      if (activeBackButtonEntries.length === 0) {
        scheduleTelegramBackButtonHide(webApp);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
