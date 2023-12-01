import React, { ReactNode } from "react";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";

type Props = {
  text: string;
  children: ReactNode;
  isRequired?: boolean;
};

export const Label = (props: Props) => {
  return (
    <label
      className={css({ display: "flex", flexDirection: "column", gap: 4 })}
    >
      <span className={css({ marginLeft: 12 })}>
        {props.text}
        {props.isRequired && (
          <span
            className={css({
              paddingLeft: 4,
              color: theme.danger,
            })}
          >
            *
          </span>
        )}
      </span>
      {props.children}
    </label>
  );
};
