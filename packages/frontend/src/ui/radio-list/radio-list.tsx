import { Flex } from "../flex.tsx";
import { ReactNode } from "react";
import { RadioBoxFilled } from "./radio-box-filled.tsx";
import { RadioBoxEmpty } from "./radio-box-empty.tsx";
import { cn } from "../cn.ts";

type RadioItemId = string | number | null;

type Props<T extends RadioItemId> = {
  selectedId: T;
  options: Array<{ id: T; title: ReactNode }>;
  onChange: (selectedId: T) => void;
};

export function RadioList<T extends RadioItemId>(props: Props<T>) {
  const { selectedId, options, onChange } = props;

  return (
    <Flex fullWidth direction={"column"} gap={6}>
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        return (
          <div
            key={option.id}
            className={cn(
              "flex items-center gap-2 p-4 px-3.5 bg-bg rounded-xl cursor-pointer",
              isSelected && "outline-2 outline-button",
            )}
            onClick={() => onChange(option.id)}
          >
            {isSelected ? <RadioBoxFilled /> : <RadioBoxEmpty />}
            <div className="w-full">{option.title}</div>
          </div>
        );
      })}
    </Flex>
  );
}
