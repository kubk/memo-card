import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { Flex } from "../../ui/flex.tsx";
import React from "react";
import { HorizontalDivider } from "../../ui/horizontal-divider.tsx";
import { t } from "../../translations/t.ts";
import { reset } from "../../ui/reset.ts";

type Props = {
  title: string;
  price: string;
  description?: string[];
  onClick?: () => void;
  isSelected?: boolean;
  paidUntil?: string;
};

export const PlanItem = (props: Props) => {
  const { title, description, onClick, isSelected, paidUntil, price } = props;

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
          backgroundColor: theme.bgColor,
          borderRadius: theme.borderRadius,
          cursor: "pointer",
        }),
        isSelected &&
          css({
            border: `2px solid ${theme.buttonColor}`,
            borderRadius: theme.borderRadius,
          }),
      )}
    >
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <h3
          className={css({
            fontSize: 18,
            color: theme.textColor,
            padding: 0,
            margin: 0,
          })}
        >
          {title}
        </h3>
        <h2 className={css({ color: "inherit", padding: 0, margin: 0 })}>
          {price}
        </h2>
      </Flex>
      {description && (
        <ul
          className={cx(
            reset.ul,
            css({
              paddingLeft: 0,
              color: theme.textColor,
            }),
          )}
        >
          {description.map((item, i) => (
            <li key={i}>
              <i
                className={cx(
                  "mdi mdi-check-circle",
                  css({ color: theme.success }),
                )}
              />{" "}
              {item}
            </li>
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
            {t("payment_paid_until")}: {paidUntil}
          </div>
        </>
      )}
    </div>
  );
};
