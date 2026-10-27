import * as m from "motion/react-m";
import { cn } from "./cn.ts";

type Props = {
  value: number;
  max: number;
  label?: string;
  color?: "success" | "button";
};

const fillClassNames = {
  success: "bg-success",
  button: "bg-button",
};

const labelClassName =
  "absolute inset-0 flex items-center justify-center text-sm font-semibold";

export function ProgressBar(props: Props) {
  const { value, max, label, color = "success" } = props;
  const percent = (value / max) * 100;
  const text = label ?? `${value}/${max}`;
  return (
    <div className="w-full bg-bg rounded-xl relative overflow-hidden">
      <m.div
        initial={false}
        animate={{ width: `${percent}%` }}
        className={cn(fillClassNames[color], "h-[30px]")}
      />
      <div className={cn(labelClassName, "text-text")}>{text}</div>
      <m.div
        initial={false}
        animate={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        className={cn(labelClassName, "text-white")}
      >
        {text}
      </m.div>
    </div>
  );
}
