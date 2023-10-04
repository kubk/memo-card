import React, { ReactNode } from "react";
import { css } from "@emotion/css";

type Props = {
  text: string;
  children: ReactNode;
};

export const Label = (props: Props) => {
  return (
    <label
      className={css({ display: "flex", flexDirection: "column", gap: 4 })}
    >
      <span>{props.text}</span>
      {props.children}
    </label>
  );
};
