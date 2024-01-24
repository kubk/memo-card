import { sanitizeTextForCard } from "../../../lib/sanitize-html/sanitize-text-for-card.ts";
import React from "react";

export const CardFieldView = (props: { text: string }) => {
  const { text } = props;
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: sanitizeTextForCard(text),
      }}
    />
  );
};
