import { Skeleton } from "../../ui/skeleton.tsx";

type Props = {
  speed?: number;
};

export function CardRowLoading(props: Props) {
  return (
    <div className="flex cursor-pointer justify-center rounded-xl bg-bg p-[0.875rem_0.75rem] text-hint">
      <Skeleton
        className="h-5 w-4/5 rounded-[0.1875rem]"
        duration={props.speed}
      />
    </div>
  );
}
