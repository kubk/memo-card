import { Skeleton } from "../../ui/skeleton.tsx";

type Props = {
  speed?: number;
};

export function CardRowLoading(props: Props) {
  return (
    <div className="flex cursor-pointer justify-center rounded-[12px] bg-bg p-[14px_12px] text-hint">
      <Skeleton className="h-5 w-4/5 rounded-[3px]" duration={props.speed} />
    </div>
  );
}
