import React, { ReactNode } from "react";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";

type Props = { text: ReactNode };

export const Tag = ({ text }: Props) => (
  <div
    className={css({
      color: theme.buttonTextColor,
      backgroundColor: theme.success,
      fontWeight: 600,
      borderRadius: 4,
      fontSize: 12,
      padding: "0 4px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    })}
  >
    {text}
  </div>
);
