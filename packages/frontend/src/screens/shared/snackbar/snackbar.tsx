import { enqueueSnackbar } from "notistack";
import { theme } from "../../../ui/theme.tsx";
import { reportHandledError } from "../../../lib/rollbar/rollbar.tsx";
import { userStore } from "../../../store/user-store.ts";
import { hapticNotification } from "../../../lib/platform/telegram/haptics.ts";
import { t } from "../../../translations/t.ts";
import { ClearSnackbar } from "./clear-snackbar.tsx";
import { cn } from "../../../ui/cn.ts";
import "./notistack.css";

const sharedStyles = {
  borderRadius: theme.borderRadius,
  backgroundColor: "rgba(56, 56, 56, 0.85)",
  boxShadow: theme.boxShadow,
};

const defaultDuration = 3000;

type NotifyErrorOptions = {
  message?: string;
  duration?: number;
};

type NotifySuccessOptions = {
  duration?: number;
};

export const notifySuccess = (
  message: string,
  options?: NotifySuccessOptions,
) => {
  const duration = options?.duration || defaultDuration;
  enqueueSnackbar(message, {
    variant: "success",
    action: (snackbarId) => <ClearSnackbar snackbarId={snackbarId} />,
    style: sharedStyles,
    autoHideDuration: duration,
  });
  hapticNotification("success");
};

export const notifyError = (report?: any, options?: NotifyErrorOptions) => {
  const message = options?.message || t("error_solving");
  const duration = options?.duration || defaultDuration;

  enqueueSnackbar(
    <div>
      <div className={cn("font-medium")}>{t("error")}</div>
      <div>{message}</div>
    </div>,
    {
      variant: "error",
      action: (snackbarId) => <ClearSnackbar snackbarId={snackbarId} />,
      style: sharedStyles,
      autoHideDuration: duration,
    },
  );

  hapticNotification("error");

  if (report) {
    report.userId = userStore.user?.id;
    reportHandledError(message, report);
  }
};
