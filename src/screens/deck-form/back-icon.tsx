import { css, cx } from "@emotion/css";
import React from "react";

type BackIconParams = { onClick: () => void };

export const BackIcon = (props: BackIconParams) => {
  const { onClick } = props;
  return (
    <i
      className={cx(
        "mdi mdi-chevron-left mdi-24px",
        css({ position: "absolute", top: 0, left: -4 }),
      )}
      onClick={onClick}
    />
  );
};
