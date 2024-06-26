import { css } from "@emotion/css";
import React, { ReactNode } from "react";
import { theme } from "./theme.tsx";

type Props = {
  children: ReactNode;
};

export const EmptyState = (props: Props) => {
  const { children } = props;

  return (
    <div
      className={css({
        width: "100%",
        textAlign: "center",
        marginTop: 8,
        fontSize: 14,
        color: theme.hintColor,
      })}
    >
      {children}
    </div>
  );
};
