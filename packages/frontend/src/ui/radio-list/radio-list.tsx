import { Flex } from "../flex.tsx";
import { ReactNode } from "react";
import { RadioBoxFilled } from "./radio-box-filled.tsx";
import { RadioBoxEmpty } from "./radio-box-empty.tsx";
import { cn } from "../cn.ts";
import { platform } from "../../lib/platform/platform.ts";

type RadioItemId = string | number | null;

type Props<T extends RadioItemId> = {
  selectedId: T;
  options: Array<{ id: T; title: ReactNode; description?: ReactNode }>;
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
            onClick={() => {
              platform.haptic("selection");
              onChange(option.id);
            }}
          >
            {isSelected ? <RadioBoxFilled /> : <RadioBoxEmpty />}
            <div className="w-full">
              <div>{option.title}</div>
              {option.description && (
                <div className="text-sm text-hint mt-1">
                  {option.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </Flex>
  );
}
