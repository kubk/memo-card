import { closeSnackbar, SnackbarKey } from "notistack";
import { css, cx } from "@emotion/css";
import { reset } from "../../../ui/reset.ts";
import { theme } from "../../../ui/theme.tsx";

type Props = { snackbarId: SnackbarKey };

export const ClearSnackbar = (props: Props) => {
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
