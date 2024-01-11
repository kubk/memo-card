import { css } from "@emotion/css";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export const ButtonGrid = (props: Props) => {
  const { children } = props;
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
      })}
    >
      {children}
    </div>
  );
};
