import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import React from "react";

export const ListHeader = (props: { text: string }) => {
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
        color: theme.hintColor,
        textTransform: "uppercase",
      })}
    >
      {props.text}
    </h5>
  );
};
