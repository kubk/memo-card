import { closeSnackbar, enqueueSnackbar, type SnackbarOrigin } from "notistack";
import { theme } from "../../../ui/theme.tsx";
import { reportHandledError } from "../../../lib/rollbar/rollbar.tsx";
import { userStore } from "../../../store/user-store.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { t } from "../../../translations/t.ts";
import { ClearSnackbar } from "./clear-snackbar.tsx";
import { cn } from "../../../ui/cn.ts";
import "./notistack.css";

export function SnackbarWrapper({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

const sharedStyles = {
  borderRadius: theme.borderRadius,
  backgroundColor: "rgba(56, 56, 56, 0.85)",
  boxShadow: theme.boxShadow,
};

const defaultDuration = 3000;

type NotifyErrorOptions = {
  message?: string;
  duration?: number;
  anchorOrigin?: SnackbarOrigin;
};

type NotifySuccessOptions = {
  duration?: number;
  anchorOrigin?: SnackbarOrigin;
};

export const notifySuccess = (
  message: string | React.ReactNode,
  options?: NotifySuccessOptions,
) => {
  const duration = options?.duration || defaultDuration;
  const id = enqueueSnackbar(message, {
    variant: "success",
    action: (snackbarKey) => <ClearSnackbar snackbarId={snackbarKey} />,
    style: sharedStyles,
    autoHideDuration: duration,
    anchorOrigin: options?.anchorOrigin,
  });
  platform.haptic("success");

  return {
    clear: () => {
      closeSnackbar(id);
    },
  };
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
      anchorOrigin: options?.anchorOrigin,
      autoHideDuration: duration,
    },
  );

  platform.haptic("error");

  if (report) {
    report.userId = userStore.user?.id;
    reportHandledError(message, report);
  }
};
