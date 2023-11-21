import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

export const SettingsRow = observer((props: Props) => {
  return (
    <label
      onClick={props.onClick}
      className={css({
        backgroundColor: theme.secondaryBgColor,
        borderRadius: theme.borderRadius,
        height: 48,
        boxSizing: "border-box",
        padding: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      })}
    >
      {props.children}
    </label>
  );
});
