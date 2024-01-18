import React from "react";
import { observer } from "mobx-react-lite";
import "./segmented-control.css";

type OptionType = string;

type Option<T extends OptionType> = {
  id: T;
  label: string;
};

type Props<T extends OptionType> = {
  options: Option<T>[];
  selectedId?: T;
  onChange: (id: T) => void;
};

export const SegmentedControl = observer(function <T extends OptionType>(
  props: Props<T>,
) {
  const { options, selectedId, onChange } = props;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.id as T);
  };

  return (
    <div className="segmented-controls">
      {options.map((option) => (
        <React.Fragment key={option.id}>
          <input
            id={option.id}
            name="segmented-control"
            type="radio"
            checked={option.id === selectedId}
            onChange={handleChange}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </React.Fragment>
      ))}
    </div>
  );
});
