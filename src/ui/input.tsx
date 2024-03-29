import React, { ChangeEvent, useEffect, useRef } from "react";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import { TextField } from "mobx-form-lite";
import { observer } from "mobx-react-lite";
import autosize from "autosize";
import { ValidationError } from "./validation-error.tsx";
import { Flex } from "./flex.tsx";
import WebApp from "@twa-dev/sdk";

interface Props {
  placeholder?: string;
  type?: "input" | "textarea";
  field: TextField<string>;
  rows?: number;
}

export const Input = observer((props: Props) => {
  const { field, placeholder, type, rows } = props;
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
    <Flex direction={"column"} gap={4}>
      <Tag
        ref={inputRef as any}
        className={css({
          display: "flex",
          padding: 10,
          fontSize: 16,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor:
            isTouched && error ? theme.danger : theme.secondaryBgColor,
          borderRadius: theme.borderRadius,
          backgroundColor: theme.bgColor,
          transition: "border-color 0.3s",
          ":focus": {
            borderColor: theme.buttonColor,
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
      {isTouched && error ? <ValidationError error={error} /> : null}
    </Flex>
  );
});
