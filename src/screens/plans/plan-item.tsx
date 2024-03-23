import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { Flex } from "../../ui/flex.tsx";
import React from "react";
import { HorizontalDivider } from "../../ui/horizontal-divider.tsx";

type Props = {
  title: string;
  description?: string[];
  onClick?: () => void;
  isSelected?: boolean;
  paidUntil?: string;
};

export const PlanItem = (props: Props) => {
  const { title, description, onClick, isSelected, paidUntil } = props;

  return (
    <div
      onClick={onClick}
      className={cx(
        css({
          padding: 16,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          width: "100%",
          gap: 4,
          color: theme.buttonColor,
          boxShadow: theme.boxShadow,
          backgroundColor: theme.buttonColorLighter,
          borderRadius: theme.borderRadius,
          cursor: "pointer",
        }),
        isSelected &&
          css({
            border: "4px solid " + theme.buttonColor,
            borderRadius: theme.borderRadius,
          }),
      )}
    >
      <Flex alignItems={"center"} gap={8} justifyContent={"center"}>
        <h3 className={css({ color: "inherit" })}>{title}</h3>
      </Flex>
      {description && (
        <ul className={cx(css({ fontSize: 14, paddingLeft: 26 }))}>
          {description.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {paidUntil && (
        <>
          <HorizontalDivider color={theme.buttonColor} />
          <div
            className={css({
              fontSize: 16,
              fontWeight: 600,
              color: theme.buttonColor,
              textAlign: "center",
            })}
          >
            Paid until: {paidUntil}
          </div>
        </>
      )}
    </div>
  );
};
