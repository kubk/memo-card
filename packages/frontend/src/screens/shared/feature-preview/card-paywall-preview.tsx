import { HorizontalDivider } from "../../../ui/horizontal-divider.tsx";
import { cn } from "../../../ui/cn.ts";

type Props = {
  front: string;
  back: string;
  example?: string;
  size?: "normal" | "big";
};

export function CardPaywallPreview(props: Props) {
  const { front, back, example, size = "normal" } = props;

  return (
    <div
      className={cn(
        "box-border rounded-[12px] text-text flex flex-col items-center justify-center p-[8px] bg-secondary-bg mr-3 last:mr-0",
        size === "normal"
          ? "h-[200px] min-w-[200px]"
          : "h-[250px] min-w-[250px]",
      )}
    >
      <div className="font-semibold text-sm break-words">{front}</div>
      <HorizontalDivider />
      <div className="font-semibold text-sm break-words">{back}</div>
      {example ? (
        <div
          className={cn(
            "pt-2 font-normal text-sm text-center",
            size === "normal" ? "max-w-[200px]" : "max-w-[250px]",
          )}
        >
          {example}
        </div>
      ) : null}
    </div>
  );
}
