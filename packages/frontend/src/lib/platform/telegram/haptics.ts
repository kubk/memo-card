import { BrowserPlatform } from "../browser/browser-platform.ts";
import { platform } from "../platform.ts";
import { getWebApp } from "./telegram-web-app.ts";
import { webMobileHaptic } from "./webMobileHaptic.ts";

function isTelegramMobile() {
  return getWebApp().platform === "ios" || getWebApp().platform === "android";
}

function isWebMobile() {
  // Returns true if the platform is browser (not Telegram) and it's iOS or Android
  return platform instanceof BrowserPlatform && platform.isMobile;
}

export type HapticNotificationType = "error" | "success" | "warning";
export type HapticImpactType = "light" | "medium" | "heavy";

export const hapticNotification = (type: HapticNotificationType) => {
  if (isTelegramMobile()) {
    getWebApp().HapticFeedback.notificationOccurred(type);
  }

  if (isWebMobile()) {
    webMobileHaptic(type);
  }
};

export const hapticImpact = (type: HapticImpactType) => {
  if (isTelegramMobile()) {
    getWebApp().HapticFeedback.impactOccurred(type);
  }

  if (isWebMobile()) {
    webMobileHaptic(type);
  }
};

export const hapticSelection = () => {
  if (isTelegramMobile()) {
    getWebApp().HapticFeedback.selectionChanged();
  }
  if (isWebMobile()) {
    webMobileHaptic("selection");
  }
};
