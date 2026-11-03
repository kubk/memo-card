import type * as React from "preact/compat";
import { reportHandledError } from "../../../lib/rollbar/rollbar.tsx";
import { userStore } from "../../../store/user-store.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { t } from "../../../translations/t.ts";
import { toastStore } from "./toast-store.ts";

const defaultDuration = 3000;
const loadingDuration = 10000;

export const notifySuccess = (message: string | React.ReactNode) => {
  const id = toastStore.show({
    variant: "success",
    message,
    duration: defaultDuration,
  });
  platform.haptic("success");

  return {
    clear: () => {
      toastStore.close(id);
    },
  };
};

export const notifyLoading = (message: string) => {
  const id = toastStore.show({
    variant: "loading",
    message,
    duration: loadingDuration,
  });

  return {
    clear: () => {
      toastStore.close(id);
    },
  };
};

export const notifyError = (report?: any) => {
  const message = t("error_solving");

  toastStore.show({
    variant: "error",
    title: t("error"),
    message,
    duration: defaultDuration,
  });

  platform.haptic("error");

  if (report) {
    report.userId = userStore.user?.id;
    reportHandledError(message, report);
  }
};
