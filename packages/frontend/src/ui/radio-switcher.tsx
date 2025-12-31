import { isDarkTheme } from "../lib/color-scheme/is-dark-theme.tsx";
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
        "inline-flex items-center rounded-[38px] px-2 h-[26px] w-[40px] cursor-pointer relative whitespace-nowrap transition-colors duration-200 mb-0",
        isDarkTheme() ? "bg-[#0f0f0f]" : "bg-[#e8ecef]",
        !isOn && !isDarkTheme() && "outline-1 outline-white",
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
          "flex justify-center items-center absolute bg-white shadow w-[19px] h-[19px] rounded-full transition-[left,background-color] duration-200 ease-in-out left-1",
          isOn && "left-[calc(100%_-_23px)]",
        )}
      />
    </label>
  );
}
