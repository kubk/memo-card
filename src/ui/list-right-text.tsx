import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import React from "react";

type ListRightTextParams = {
  text: string;
  cut?: boolean;
};

export const ListRightText = (props: ListRightTextParams) => {
  const { text, cut } = props;
  if (!text) {
    return null;
  }

  const textFormatted =
    text.length > 10 && cut ? `${text.slice(0, 10)}...` : text;

  return (
    <div className={css({ fontSize: 16, color: theme.hintColor })}>
      {textFormatted}
    </div>
  );
};
