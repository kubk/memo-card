import { css } from "@emotion/css";
import React from "react";

export const Loader = () => {
  return (
    <div className={css({ width: "100%", textAlign: "center" })}>
      <i className={"mdi mdi-loading mdi-spin mdi-24px"} />
    </div>
  );
};
