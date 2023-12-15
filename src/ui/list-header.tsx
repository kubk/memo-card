import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import React, { ReactNode } from "react";

type Props = {
  text: string;
  rightSlot?: ReactNode;
};

export const ListHeader = (props: Props) => {
  const { text, rightSlot } = props;

  return (
    <h5
      className={css({
        fontWeight: 400,
        margin: 0,
        padding: 0,
        paddingLeft: 12,
        paddingTop: 4,
        paddingBottom: 0,
        marginBottom: 4,
        position: "relative",
        color: theme.hintColor,
        textTransform: "uppercase",
      })}
    >
      {text}
      {rightSlot}
    </h5>
  );
};
