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
  button: "bg-button/40",
};

export function ProgressBar(props: Props) {
  const { value, max, label, color = "success" } = props;
  return (
    <div className="w-full bg-bg rounded-xl relative overflow-hidden">
      <m.div
        initial={false}
        animate={{ width: `${(value / max) * 100}%` }}
        className={cn(fillClassNames[color], "h-7.5")}
      />
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-text">
        {label ?? `${value}/${max}`}
      </div>
    </div>
  );
}
