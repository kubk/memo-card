import { css, cx } from "@emotion/css";
import React from "react";

type Props = {
  backgroundColor: string;
  icon: string;
};

export const FilledIcon = (props: Props) => {
  const { backgroundColor, icon } = props;
  return (
    <div
      className={css({
        backgroundColor: backgroundColor,
        borderRadius: 8,
        width: 30,
        height: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <i className={cx("mdi", icon, css({ color: "#fff" }))} />
    </div>
  );
};
