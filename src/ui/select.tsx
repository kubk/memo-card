import React, { useEffect, useRef } from "react";
import { theme } from "./theme.tsx";
import { css } from "@emotion/css";

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type Props<T extends string | number> = {
  value: string;
  onChange: (newValue: T) => void;
  options: Option<T>[];
};

export const Select = <T extends string | number>({
  value,
  onChange,
  options,
}: Props<T>) => {
  return (
    <select
      className={css({
        backgroundColor: "transparent",
        boxShadow: "none",
        outline: "none",
        fontSize: 16,
        border: "none",
        "-webkit-appearance": "none",
        cursor: "pointer",
        color: theme.linkColor,
      })}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
