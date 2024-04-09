import React from "react";
import { theme } from "./theme.tsx";
import { css } from "@emotion/css";
import { t } from "../translations/t.ts";

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type Props<T extends string | number> = {
  value: string;
  onChange: (newValue: T) => void;
  options: Option<T>[];
  isLoading?: boolean;
  selectRef?: any;
};

export const Select = <T extends string | number>(props: Props<T>) => {
  const { value, onChange, options, isLoading, selectRef } = props;
  if (isLoading) {
    return (
      <div className={css({ color: theme.hintColor })}>{t("ui_loading")}</div>
    );
  }

  return (
    <select
      ref={selectRef}
      className={css({
        backgroundColor: "transparent",
        boxShadow: "none",
        outline: "none",
        fontSize: 16,
        border: "none",
        WebkitAppearance: "none",
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
