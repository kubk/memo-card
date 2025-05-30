import { cn } from "../../ui/cn.ts";

type Props = {
  color: string;
};

export function LegendItem(props: Props) {
  const { color } = props;
  return (
    <div
      className={cn("h-[14px] w-[14px] rounded-[4px] border-2 border-bg")}
      style={{ backgroundColor: color }}
    />
  );
}
