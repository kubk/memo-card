import React, { useRef } from "react";
import { theme } from "./theme.tsx";
import { css } from "@emotion/css";
import { ChevronIcon } from "./chevron-icon.tsx";
import { Select } from "./select.tsx";

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type Props<T extends string | number> = {
  value: string;
  onChange: (newValue: T) => void;
  options: Option<T>[];
  isLoading?: boolean;
};

export const SelectWithChevron = <T extends string | number>(
  props: Props<T>,
) => {
  const { isLoading } = props;

  const selectRef = useRef<HTMLSelectElement | null>(null);

  if (isLoading) {
    return <div className={css({ color: theme.hintColor })}>Loading...</div>;
  }

  return (
    <div
      className={css({
        display: "flex",
        gap: 8,
        alignItems: "center",
        backgroundColor: theme.bgColor,
        cursor: "pointer",
        padding: "12px 16px",
        flex: 1,
        justifyContent: "space-between",
        borderRadius: theme.borderRadius,
      })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        selectRef.current?.dispatchEvent(
          new MouseEvent("mousedown", {
            view: window,
            bubbles: true,
            cancelable: true,
          }),
        );
      }}
    >
      <Select selectRef={selectRef} {...props} />
      <ChevronIcon
        direction={"bottom"}
        className={css({
          color: theme.linkColor,
          position: "relative",
          top: 1.5,
        })}
      />
    </div>
  );
};
