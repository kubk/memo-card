import * as m from "motion/react-m";
import { SVGProps } from "preact/compat";
import { userStore } from "../store/user-store.ts";
import { cn } from "./cn.ts";

type Direction = "top" | "bottom" | "right";

const getRotation = (direction: Direction) => {
  switch (direction) {
    case "top":
      return 0;
    case "right":
      if (userStore.isRtl) {
        return 270;
      }
      return 90;
    case "bottom":
      return 180;
  }
};

type Props = Pick<SVGProps<SVGSVGElement>, "onClick" | "className"> & {
  direction: Direction;
  size?: 16 | 20 | 24;
};

export function ChevronIcon(props: Props) {
  const { direction, size = 16, className, ...restProps } = props;
  return (
    <m.svg
      tabIndex={-1}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: getRotation(direction) }}
      initial={false}
      className={cn(
        "focus:outline-hidden transition-[scale] duration-200 ease-out active:scale-90",
        className,
      )}
      {...restProps}
    >
      <path
        d="M4 10.5L8.5 6L13 10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </m.svg>
  );
}
