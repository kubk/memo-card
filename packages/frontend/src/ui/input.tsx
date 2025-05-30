import { ChangeEvent, ReactNode, useEffect, useRef } from "react";
import { TextField } from "mobx-form-lite";
import autosize from "autosize";
import { ValidationError } from "./validation-error.tsx";
import { platform } from "../lib/platform/platform.ts";
import { TelegramPlatform } from "../lib/platform/telegram/telegram-platform.ts";
import { cn } from "./cn.ts";

type Props = {
  placeholder?: string;
  type?: "input" | "textarea";
  field: TextField<string>;
  isDisabled?: boolean;
  rows?: number;
  icon?: string | ReactNode;
  noAutoSize?: boolean;
};

export function Input(props: Props) {
  const noAutoSize = props.noAutoSize || false;
  const { field, placeholder, type, rows, icon, isDisabled } = props;
  const { onChange, value, isTouched, error, onBlur } = field;
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  const Tag = type === "textarea" ? "textarea" : "input";

  useEffect(() => {
    if (platform instanceof TelegramPlatform && platform.isIos()) {
      return;
    }

    if (type === "textarea" && inputRef.current) {
      if (!noAutoSize) {
        autosize(inputRef.current);
      }
    }
  }, [type, noAutoSize]);

  return (
    <div className="flex flex-col gap-[4px] relative">
      <Tag
        ref={inputRef as any}
        className={cn(
          "flex py-3.5 px-2.5 text-base border-2 border-solid rounded-xl bg-bg transition-colors duration-300",
          icon && "pl-10",
          isTouched && error ? "border-danger" : "border-secondary-bg",
          "focus:outline-none",
          isTouched && error ? "focus:border-danger" : "focus:border-button",
          isDisabled && "opacity-40 cursor-not-allowed",
        )}
        disabled={isDisabled}
        type="text"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={handleInputChange}
      />
      {icon ? (
        typeof icon === "string" ? (
          <i
            className={cn(
              "mdi",
              icon,
              "absolute top-[8px] left-[12px] text-hint",
            )}
          />
        ) : (
          <span className="absolute top-[18px] left-[12px] text-hint">
            {icon}
          </span>
        )
      ) : null}
      {isTouched && error ? <ValidationError error={error} /> : null}
    </div>
  );
}
