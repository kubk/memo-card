import { css } from "@emotion/css";
import React, { ReactNode } from "react";
import { theme } from "./theme.tsx";

type Props = {
  children: ReactNode;
};

export const HintTransparent = (props: Props) => {
  const { children } = props;

  return (
    <span
      className={css({
        fontSize: 14,
        padding: "0 12px",
        marginTop: -4,
        borderRadius: theme.borderRadius,
        color: theme.hintColor,
        textTransform: "none",
      })}
    >
      {children}
    </span>
  );
};
