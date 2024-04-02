import React, { ReactNode } from "react";
import { css, cx } from "@emotion/css";
import { theme } from "./theme.tsx";
import { Flex } from "./flex.tsx";
import { reset } from "./reset.ts";

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
    <Tag
      className={cx(
        reset.label,
        css({ display: "flex", flexDirection: "column", gap: 0 }),
      )}
    >
      <Flex ml={12} alignItems={"center"}>
        <span
          className={css({
            color: theme.hintColor,
            textTransform: "uppercase",
            fontSize: 14,
          })}
        >
          {props.text}
        </span>
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
              fontSize: 14,
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
