import { css, cx } from "@emotion/css";
import { reset } from "./reset.ts";
import { theme } from "./theme.tsx";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export const CenteredUnstyledButton = (props: Props) => {
  const { children, onClick } = props;

  return (
    <button
      className={cx(
        reset.button,
        css({
          width: "100%",
          color: theme.linkColor,
          fontSize: 14,
          paddingTop: 6,
          textTransform: "uppercase",
          ":active": {
            transform: "scale(0.97)",
          },
        }),
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
