import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";

type Props = {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
};

export const Screen = observer((props: Props) => {
  const { children, title, subtitle } = props;
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        marginBottom: 16,
      })}
    >
      <div>
        <h3 className={css({ textAlign: "center"})}>{title}</h3>
        {subtitle}
      </div>
      {children}
    </div>
  );
});
