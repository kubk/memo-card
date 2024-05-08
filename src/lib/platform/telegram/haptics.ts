import WebApp from "@twa-dev/sdk";

const isIos = WebApp.platform === "ios";

export type HapticNotificationType = "error" | "success" | "warning";

export const hapticNotification = (type: HapticNotificationType) => {
  if (!isIos) {
    return;
  }
  WebApp.HapticFeedback.notificationOccurred(type);
};

export type HapticImpactType = "light" | "medium" | "heavy";

export const hapticImpact = (type: HapticImpactType) => {
  if (!isIos) {
    return;
  }
  WebApp.HapticFeedback.impactOccurred(type);
};

export const hapticSelection = () => {
  if (!isIos) {
    return;
  }
  WebApp.HapticFeedback.selectionChanged();
};
