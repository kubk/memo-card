import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";

export const FullScreenLoader = () => {
  return (
    <div
      className={css({
        display: "flex",
        height: "100vh",
        backgroundColor: theme.bgColor,
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <i className={"mdi mdi-loading mdi-spin mdi-48px"} />
    </div>
  );
};
