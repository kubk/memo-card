import { cn } from "../cn";

type Props = { color: string; className?: string };

export function ColorIcon(props: Props) {
  const { color, className } = props;

  return (
    <div
      style={{
        backgroundColor: color,
      }}
      className={cn(
        "w-[16px] h-[16px] ml-[7px] rounded-[4px] border border-white",
        className,
      )}
    />
  );
}
