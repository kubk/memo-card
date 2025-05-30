import { getWebApp } from "./telegram-web-app.ts";

const isIos = () => getWebApp().platform === "ios";
const isAndroid = () => getWebApp().platform === "android";

const isHapticEnabled = isIos() || isAndroid();

export type HapticNotificationType = "error" | "success" | "warning";

export const hapticNotification = (type: HapticNotificationType) => {
  if (!isHapticEnabled) {
    return;
  }
  getWebApp().HapticFeedback.notificationOccurred(type);
};

export type HapticImpactType = "light" | "medium" | "heavy";

export const hapticImpact = (type: HapticImpactType) => {
  if (!isHapticEnabled) {
    return;
  }
  getWebApp().HapticFeedback.impactOccurred(type);
};

export const hapticSelection = () => {
  if (!isHapticEnabled) {
    return;
  }
  getWebApp().HapticFeedback.selectionChanged();
};
