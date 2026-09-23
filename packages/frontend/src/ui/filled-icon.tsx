import { ReactNode } from "react";
import { cn } from "./cn.ts";

type Props = {
  className: string;
  icon: ReactNode;
};

export function FilledIcon({ className, icon }: Props) {
  return (
    <div
      className={cn(
        "rounded-lg w-[30px] h-[30px] flex justify-center text-white items-center",
        className,
      )}
    >
      {icon}
    </div>
  );
}

export function TransparentIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="rounded-lg w-[30px] h-[30px] flex justify-center items-center">
      {icon}
    </div>
  );
}
