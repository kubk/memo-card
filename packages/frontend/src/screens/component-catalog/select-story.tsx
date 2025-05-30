import { Select } from "../../ui/select.tsx";
import { useState } from "react";

const countries = [
  { value: "us", label: "United States" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
];

type Country = (typeof countries)[number]["value"];

export function SelectStory() {
  const [value, setValue] = useState<Country>("us");
  return (
    <Select
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      options={countries}
    />
  );
}
