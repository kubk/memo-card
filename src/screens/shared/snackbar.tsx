import {
  closeSnackbar,
  enqueueSnackbar,
  type SnackbarKey,
  SnackbarProvider,
} from "notistack";
import { css, cx } from "@emotion/css";
import { reset } from "../../ui/reset.ts";
import { theme } from "../../ui/theme.tsx";
import { reportHandledError } from "../../lib/rollbar/rollbar.tsx";
import { userStore } from "../../store/user-store.ts";

const ClearSnackbar = (props: { snackbarId: SnackbarKey }) => {
  const { snackbarId } = props;
  return (
    <button
      className={cx(reset.button, css({ marginRight: 8 }))}
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
    >
      <i
        className={cx(
          css({ color: theme.buttonColor }),
          "mdi mdi-close-circle-outline mdi-24px",
        )}
      />
    </button>
  );
};

const sharedStyles = {
  borderRadius: theme.borderRadius,
  backgroundColor: "rgba(56, 56, 56, 0.85)",
  boxShadow: theme.boxShadow,
};

export const notifySuccess = (message: string) => {
  enqueueSnackbar(message, {
    variant: "success",
    action: (snackbarId) => <ClearSnackbar snackbarId={snackbarId} />,
    style: sharedStyles,
    autoHideDuration: 3000,
  });
};

export const notifyError = (message: string, report?: any) => {
  enqueueSnackbar(message, {
    variant: "error",
    action: (snackbarId) => <ClearSnackbar snackbarId={snackbarId} />,
    style: sharedStyles,
    autoHideDuration: 4000,
  });

  if (report) {
    report.userId = userStore.user?.id;
    reportHandledError(message, report);
  }
};

export const SnackbarProviderWrapper = () => {
  return (
    <SnackbarProvider
      iconVariant={{
        success: (
          <div className={css({ marginRight: 8 })}>
            <i
              className={cx(
                "mdi mdi-check-circle-outline mdi-24px",
                css({
                  color: theme.buttonColor,
                }),
              )}
            />
          </div>
        ),
        error: (
          <div className={css({ marginRight: 8 })}>
            <i
              className={cx(
                "mdi mdi-alert-circle-outline mdi-24px",
                css({
                  color: theme.danger,
                }),
              )}
            />
          </div>
        ),
      }}
    />
  );
};
