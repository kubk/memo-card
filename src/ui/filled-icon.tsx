import { css, cx } from "@emotion/css";
import React, { ReactNode } from "react";

type Props = {
  backgroundColor: string;
  icon: string | ReactNode;
};

export const FilledIcon = (props: Props) => {
  const { backgroundColor, icon } = props;
  const isIconString = typeof icon === "string";

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
      {isIconString ? (
        <i className={cx("mdi", icon, css({ color: "#fff" }))} />
      ) : (
        icon
      )}
    </div>
  );
};
