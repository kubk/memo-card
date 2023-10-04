import { css } from "@emotion/css";

export const reset = {
  button: css({
    padding: 0,
    border: 0,
    outline: 0,
    color: "inherit",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    "&:focus": {
      outline: "none",
    },
  }),
  ul: css({
    listStyle: "none",
    padding: 0,
    margin: 0,
  }),
  a: css({
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
      color: "inherit",
      textDecoration: "none",
    },
  }),
  label: css({
    marginBottom: 0,
  }),
  p: css({
    margin: 0,
  }),
};
