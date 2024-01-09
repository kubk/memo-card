import { sanitize } from "../../lib/sanitize-html/sanitize.ts";
import React from "react";

export const CardFieldView = (props: { text: string }) => {
  const { text } = props;
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: sanitize(text),
      }}
    />
  );
};
