import { ReactNode } from "react";
import { css, cx } from "@emotion/css";
import { theme } from "./theme.tsx";

type Props = {
  children: ReactNode;
  isSelected?: boolean;
  onClick: () => void;
  fullWidth?: boolean;
};

export const Chip = (props: Props) => {
  const { children, isSelected, onClick, fullWidth } = props;
  return (
    <div
      onClick={onClick}
      className={cx(
        css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 12px",
          borderRadius: 10,
          background: theme.bgColor,
          boxShadow: theme.boxShadow,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          color: theme.textColor,
        }),
        isSelected &&
          css({
            background: theme.buttonColor,
            color: theme.buttonTextColor,
          }),
        fullWidth && css({ width: "100%" }),
      )}
    >
      {children}
    </div>
  );
};
