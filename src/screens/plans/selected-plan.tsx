import React, { ReactNode } from "react";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";

export const SelectedPlan = (props: { children: ReactNode }) => {
  return (
    <div
      className={css({
        padding: 8,
        marginLeft: -8,
        marginRight: -8,
        border: "4px solid " + theme.textColor,
        borderRadius: theme.borderRadius,
      })}
    >
      {props.children}
      <div
        className={css({
          paddingTop: 8,
          textAlign: "center",
          color: theme.textColor,
          fontWeight: 600,
          textTransform: "uppercase",
        })}
      >
        Current plan
      </div>
    </div>
  );
};
