import React, { ReactNode } from "react";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";

type Props = {
  text: string;
  children: ReactNode;
  isRequired?: boolean;
  // Helps to avoid nested <label> tags
  isPlain?: boolean;
};

export const Label = (props: Props) => {
  const Tag = props.isPlain ? "span" : "label";

  return (
    <Tag className={css({ display: "flex", flexDirection: "column", gap: 2 })}>
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
    </Tag>
  );
};
