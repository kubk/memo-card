import React, { ReactNode } from "react";
import { css, cx } from "@emotion/css";
import { theme } from "../theme.tsx";

type Props = {
  title: ReactNode;
  onClose: () => void;
};

export const BottomSheetTitle = (props: Props) => {
  const { title, onClose } = props;

  return (
    <h2
      className={css({
        width: "100%",
        textAlign: "center",
        position: "relative",
        alignSelf: "center",
        paddingTop: 8,
        paddingBottom: 24,
      })}
    >
      {title}
      <span
        className={css({
          position: "absolute",
          right: 8,
          top: 10,
          cursor: "pointer",
          backgroundColor: theme.secondaryBgColor,
          borderRadius: "50%",
          width: 35,
          height: 35,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
        onClick={() => {
          onClose();
        }}
      >
        <i className={cx("mdi mdi-close")} />
      </span>
    </h2>
  );
};
