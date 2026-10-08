type OptionType = string | number | null;

type Option<T extends OptionType> = {
  label: string;
  value: T;
};

type Props<T extends OptionType> = {
  value: T;
  onChange: (newValue: T) => void;
  options: Option<T>[];
};

export function Select<T extends OptionType>({
  value,
  onChange,
  options,
}: Props<T>) {
  return (
    <select
      className="bg-transparent shadow-none outline-none text-base border-none appearance-none cursor-pointer text-link"
      value={value || ""}
      onChange={(e) => onChange(e.currentTarget.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value || ""}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
