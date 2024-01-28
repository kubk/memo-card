import { css } from "@emotion/css";
import React from "react";

type Props = { color: string };

export const ColorIcon = (props: Props) => {
  const { color } = props;

  return (
    <div
      className={css({
        backgroundColor: color,
        width: 16,
        height: 16,
        marginLeft: 7,
        borderRadius: 4,
        border: "1px solid #fff",
      })}
    />
  );
};
