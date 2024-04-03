import React, { ChangeEvent, useEffect, useRef } from "react";
import { css, cx } from "@emotion/css";
import { theme } from "./theme.tsx";
import { TextField } from "mobx-form-lite";
import { observer } from "mobx-react-lite";
import autosize from "autosize";
import { ValidationError } from "./validation-error.tsx";
import WebApp from "@twa-dev/sdk";

interface Props {
  placeholder?: string;
  type?: "input" | "textarea";
  field: TextField<string>;
  rows?: number;
  icon?: string;
}

export const Input = observer((props: Props) => {
  const { field, placeholder, type, rows, icon } = props;
  const { onChange, value, isTouched, error, onBlur } = field;
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  const Tag = type === "textarea" ? "textarea" : "input";

  useEffect(() => {
    if (type === "textarea" && inputRef.current && WebApp.platform !== "ios") {
      autosize(inputRef.current);
    }
  }, [type]);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "relative",
      })}
    >
      <Tag
        ref={inputRef as any}
        className={css({
          display: "flex",
          padding: "14px 10px",
          paddingLeft: icon ? 40 : undefined,
          fontSize: 16,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor:
            isTouched && error ? theme.danger : theme.secondaryBgColor,
          borderRadius: theme.borderRadius,
          backgroundColor: theme.bgColor,
          transition: "border-color 0.3s",
          ":focus": {
            borderColor: isTouched && error ? theme.danger : theme.buttonColor,
            outline: "none",
          },
        })}
        type="text"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={handleInputChange}
      />
      {icon ? (
        <i
          className={cx(
            "mdi",
            icon,
            css({
              position: "absolute",
              top: 8,
              left: 12,
              color: theme.hintColor,
            }),
          )}
        />
      ) : null}
      {isTouched && error ? <ValidationError error={error} /> : null}
    </div>
  );
});
