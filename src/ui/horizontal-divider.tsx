import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import React from "react";

type Props = {
  color?: string;
};

export const HorizontalDivider = (props: Props) => {
  const color = props.color || theme.divider;
  return (
    <div
      className={css({
        width: "100%",
        margin: "8px 0",
        height: 1,
        background: color,
      })}
    />
  );
};
