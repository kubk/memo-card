import { Fragment } from "react";

export const renderHighlightedText = (
  text: string,
  customClassName?: string,
) => {
  if (!text) return "";

  const parts = text.split(/\[|\]/);
  return parts.map((part, index) => {
    const isHighlighted = index % 2 === 1;
    return (
      <Fragment key={index}>
        {index > 0 && index % 2 === 0 && " "}
        <span
          className={
            isHighlighted ? "bg-gradient-text " + (customClassName || "") : ""
          }
        >
          {part}
        </span>
        {index % 2 === 0 && index < parts.length - 1 && " "}
      </Fragment>
    );
  });
};
