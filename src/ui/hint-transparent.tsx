import { css } from "@emotion/css";
import React, { ReactNode } from "react";
import { theme } from "./theme.tsx";

type Props = {
  children: ReactNode;
};

export const HintTransparent = (props: Props) => {
  const { children } = props;

  return (
    <div
      className={css({
        fontSize: 14,
        padding: "0 12px",
        borderRadius: theme.borderRadius,
        color: theme.hintColor,
        textTransform: "none",
      })}
    >
      {children}
    </div>
  );
};
