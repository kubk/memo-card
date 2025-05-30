import { t } from "../translations/t.ts";

type OptionType = string | number | null;

type Option<T extends OptionType> = {
  label: string;
  value: T;
};

type Props<T extends OptionType> = {
  value: T;
  onChange: (newValue: T) => void;
  options: Option<T>[];
  isLoading?: boolean;
  selectRef?: any;
};

export function Select<T extends OptionType>(props: Props<T>) {
  const { value, onChange, options, isLoading, selectRef } = props;
  if (isLoading) {
    return <div className="text-hint">{t("ui_loading")}</div>;
  }

  return (
    <select
      ref={selectRef}
      className="bg-transparent shadow-none outline-none text-base border-none appearance-none cursor-pointer text-link"
      value={value || ""}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value || ""}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
