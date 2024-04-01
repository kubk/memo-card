import { css, cx } from "@emotion/css";
import { reset } from "./reset.ts";
import React, { ReactNode } from "react";
import { theme } from "./theme.tsx";

type Props = { children: ReactNode };

export const Hint = (props: Props) => {
  return (
    <p
      className={cx(
        reset.p,
        css({
          fontSize: 14,
          padding: "8px 12px",
          borderRadius: theme.borderRadius,
          color: theme.hintColor,
          backgroundColor: theme.bgColor,
        }),
      )}
    >
      {props.children}
    </p>
  );
};
