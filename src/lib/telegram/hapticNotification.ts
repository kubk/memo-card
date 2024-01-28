import WebApp from "@twa-dev/sdk";

const isIos = WebApp.platform === "ios";

export const hapticNotification = (type: "error" | "success" | "warning") => {
  if (!isIos) {
    return;
  }
  WebApp.HapticFeedback.notificationOccurred(type);
};

export const hapticImpact = (type: "light" | "medium" | "heavy") => {
  if (!isIos) {
    return;
  }
  WebApp.HapticFeedback.impactOccurred(type);
};
