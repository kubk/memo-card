import { cn } from "./cn.ts";
import { platform } from "../lib/platform/platform.ts";

type Props = {
  isOn: boolean;
  onToggle: () => void;
};

export function RadioSwitcher(props: Props) {
  const { isOn, onToggle } = props;

  return (
    <label
      onClick={(event) => {
        event.stopPropagation();
      }}
      className={cn(
        "inline-flex items-center rounded-[2.375rem] px-2 h-6.5 w-10 cursor-pointer relative whitespace-nowrap transition-colors duration-200 mb-0",
        "bg-[#767680]/30",
        isOn && "bg-success",
      )}
    >
      <input
        type="checkbox"
        className="absolute appearance-none"
        checked={isOn}
        onChange={() => {
          platform.haptic("selection");
          onToggle();
        }}
      />
      <div
        className={cn(
          "flex justify-center items-center absolute bg-white shadow w-4.75 h-4.75 rounded-full transition-[left,background-color] duration-200 ease-in-out left-1",
          isOn && "left-[calc(100%_-_1.4375rem)]",
        )}
      />
    </label>
  );
}
