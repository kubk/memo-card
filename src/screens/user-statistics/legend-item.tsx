import { css } from "@emotion/css";
import React from "react";
import { theme } from "../../ui/theme.tsx";

type Props = {
  color: string;
};

export const LegendItem = (props: Props) => {
  const { color } = props;
  return (
    <div
      className={css({
        height: 14,
        width: 14,
        backgroundColor: color,
        borderRadius: 4,
        border: `2px solid ${theme.bgColor}`,
      })}
    />
  );
};
