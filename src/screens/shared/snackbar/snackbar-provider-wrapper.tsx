import { SnackbarProvider } from "notistack";
import { css, cx } from "@emotion/css";
import { theme } from "../../../ui/theme.tsx";

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
