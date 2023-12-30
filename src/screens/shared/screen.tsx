import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";

type Props = {
  children: ReactNode;
  title: string;
};

export const Screen = observer((props: Props) => {
  const { children, title } = props;
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
        marginBottom: 16,
      })}
    >
      <h3 className={css({ textAlign: "center" })}>{title}</h3>
      {children}
    </div>
  );
});
