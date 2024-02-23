import { css } from "@emotion/css";
import React from "react";

export const LegendItem = (props: { color: string }) => {
  const { color } = props;
  return (
    <div
      className={css({
        height: 14,
        width: 14,
        backgroundColor: color,
        borderRadius: 4
      })}
    />
  );
};
