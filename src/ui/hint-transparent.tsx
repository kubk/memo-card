import { css, cx } from "@emotion/css";
import { reset } from "./reset.ts";
import React, { ReactNode } from "react";
import { theme } from "./theme.tsx";

type Props = { children: ReactNode };

export const HintTransparent = (props: Props) => {
  const { children } = props;

  return (
    <p
      className={cx(
        reset.p,
        css({
          fontSize: 14,
          padding: "0 12px",
          marginTop: -4,
          borderRadius: theme.borderRadius,
          color: theme.hintColor,
        }),
      )}
    >
      {children}
    </p>
  );
};
