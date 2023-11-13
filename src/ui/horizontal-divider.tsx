import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import React from "react";

export const HorizontalDivider = () => {
  return (
    <div
      className={css({
        width: "100%",
        margin: "8px 0",
        height: 1,
        background: theme.hintColor,
      })}
    />
  );
};
