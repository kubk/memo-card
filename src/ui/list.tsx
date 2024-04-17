import { observer } from "mobx-react-lite";
import { css, cx } from "@emotion/css";
import { theme } from "./theme.tsx";
import { tapScale } from "../lib/animations/tap-scale.ts";
import React, { ReactNode } from "react";

export type ListItemType = {
  text: ReactNode;
  isLinkColor?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  right?: ReactNode;
  alignCenter?: boolean;
};

type Props = {
  items: Array<ListItemType>;
  animateTap?: boolean;
};

export const List = observer((props: Props) => {
  const { items } = props;
  const animateTap =
    items.length > 1
      ? false
      : props.animateTap === undefined
      ? true
      : props.animateTap;

  return (
    <div className={css({ display: "flex", flexDirection: "column" })}>
      {items.map((item, i) => {
        const showDivider = i !== items.length - 1;
        return (
          <div
            key={i}
            onClick={item.onClick}
            className={cx(
              css({
                boxSizing: "border-box",
                display: "flex",
                justifyContent: item.alignCenter ? "center" : "space-between",
                alignItems: "center",
                cursor: "pointer",
                gap: 8,
                borderRadius: 0,
                ":first-child": {
                  borderTopLeftRadius: theme.borderRadius,
                  borderTopRightRadius: theme.borderRadius,
                },
                ":last-child": {
                  borderBottomLeftRadius: theme.borderRadius,
                  borderBottomRightRadius: theme.borderRadius,
                },
                paddingLeft: 12,
                background: theme.bgColor,

                textAlign: item.alignCenter ? "center" : "left",
              }),
              animateTap ? css(tapScale) : undefined,
            )}
          >
            <div
              className={css({
                color: theme.textColor,
                alignItems: "center",
                display: "flex",
                gap: 8,
                width: item.alignCenter ? undefined : "100%",
                marginRight: item.alignCenter ? 12 : undefined,
              })}
            >
              {item.icon}
              <div
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flex: 1,
                  paddingBottom: 12,
                  paddingTop: 12,
                  borderBottom: showDivider
                    ? `1px solid ${theme.divider}`
                    : undefined,
                })}
              >
                <span
                  className={css({
                    color: item.isLinkColor ? theme.linkColor : undefined,
                  })}
                >
                  {item.text}
                </span>
                {item.right ? (
                  <div className={css({ marginRight: 10 })}>{item.right}</div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
