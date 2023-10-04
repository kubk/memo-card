import { css, cx } from "@emotion/css";
import React from "react";

export const Loader = () => {
  return (
    <i
      className={cx(
        "mdi mdi-spin mdi-loading mdi-24px",
        css({
          width: "100%",
          textAlign: "center",
        }),
      )}
    />
  );
};
