import React from "react";
import { theme } from "./theme.tsx";
import { css } from "@emotion/css";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (newValue: string) => void;
  options: Option[];
};

export const Select = ({ value, onChange, options }: Props) => {
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
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
