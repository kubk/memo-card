import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";

type Props = { children: ReactNode; onClick?: () => void };

export const SettingsRow = observer((props: Props) => {
  return (
    <label
      onClick={props.onClick}
      className={css({
        backgroundColor: theme.secondaryBgColor,
        borderRadius: theme.borderRadius,
        height: 40,
        padding: "0px 12px",
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
