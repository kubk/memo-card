import React, { ReactNode } from "react";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import { Flex } from "./flex.tsx";

type Props = {
  text: ReactNode;
  children: ReactNode;
  isRequired?: boolean;
  // Helps to avoid nested <label> tags
  isPlain?: boolean;
  slotRight?: ReactNode;
};

export const Label = (props: Props) => {
  const Tag = props.isPlain ? "span" : "label";
  const { slotRight } = props;

  return (
    <Tag className={css({ display: "flex", flexDirection: "column", gap: 2 })}>
      <Flex ml={12}>
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
        {slotRight && (
          <span
            className={css({
              marginLeft: "auto",
              marginRight: 12,
            })}
          >
            {slotRight}
          </span>
        )}
      </Flex>
      {props.children}
    </Tag>
  );
};
