import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import React from "react";

type Props = { number: number };

export const CardNumber = (props: Props) => {
  const { number } = props;

  return (
    <span
      className={css({
        color: theme.hintColor,
      })}
    >
      {number}.{" "}
    </span>
  );
};
