import { css } from "@emotion/css";

export const reset = {
  button: css({
    padding: 0,
    border: 0,
    outline: 0,
    color: "inherit",
    fontFamily: "inherit",
    cursor: "pointer",
    backgroundColor: "transparent",
    "&:focus": {
      outline: "none",
    },
  }),
};
