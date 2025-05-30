import { useRef } from "react";
import { ChevronIcon } from "./chevron-icon.tsx";
import { Select } from "./select.tsx";
import { t } from "../translations/t.ts";

type OptionType = string | number;

type Option<T extends OptionType> = {
  label: string;
  value: T;
};

type Props<T extends OptionType> = {
  value: T;
  onChange: (newValue: T) => void;
  options: Option<T>[];
  isLoading?: boolean;
};

export function SelectWithChevron<T extends OptionType>(props: Props<T>) {
  const { isLoading } = props;

  const selectRef = useRef<HTMLSelectElement | null>(null);

  if (isLoading) {
    return <div className="text-hint">{t("ui_loading")}</div>;
  }

  return (
    <div
      className="flex gap-2 items-center bg-bg cursor-pointer px-4 py-3 flex-1 justify-between rounded-xl"
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
        className="text-link relative top-[1.5px]"
      />
    </div>
  );
}
