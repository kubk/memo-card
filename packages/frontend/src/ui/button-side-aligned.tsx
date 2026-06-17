import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useMemo,
} from "react";
import { colord } from "colord";
import { reset } from "./reset.ts";
import { theme } from "./theme.tsx";
import { userStore } from "../store/user-store.ts";
import { screenStore } from "../store/screen-store.ts";
import { StarIcon } from "lucide-react";
import { cn } from "./cn.ts";

type Props = {
  mainColor?: string;
  outline?: boolean;
  icon: ReactNode;
  column?: boolean;
  align?: "left" | "center";
  isPro?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonStyle = CSSProperties & {
  "--button-bg": string;
  "--button-color": string;
};

export function ButtonSideAligned(props: Props) {
  const align = props.align || "left";
  const {
    className,
    mainColor = theme.buttonColorComputed,
    outline,
    children,
    icon,
    column,
    isPro,
    onClick,
    style,
    ...restProps
  } = props;
  const showProBadge = isPro && !userStore.isPaid;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isPro && !userStore.isPaid) {
      screenStore.push({ type: "plans", planType: "pro" });
      return;
    }
    onClick?.(e);
  };

  const parsedColor = useMemo(() => colord(mainColor), [mainColor]);
  const buttonStyle: ButtonStyle = {
    "--button-bg": outline ? parsedColor.alpha(0.2).toHex() : mainColor,
    "--button-color": outline ? mainColor : theme.buttonTextColorComputed,
    ...style,
  };

  return (
    <button
      {...restProps}
      onClick={handleClick}
      style={buttonStyle}
      className={cn(
        reset.button,
        "relative flex h-[45px] w-full items-center justify-center rounded-xl bg-[var(--button-bg)] px-3 py-3 text-sm font-semibold leading-[1.5] text-[var(--button-color)] select-none transition-[background-color,border,box-shadow,color] duration-200 ease-in-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        column ? "flex-col gap-0" : "gap-2",
        className,
      )}
    >
      <span
        className={cn(
          "absolute flex items-center gap-2",
          align === "center"
            ? "left-1/2 -translate-x-1/2"
            : userStore.isRtl
              ? "right-4"
              : "left-4",
        )}
      >
        {icon ? icon : null}
        {children}
      </span>
      {showProBadge && (
        <span
          className={cn(
            "absolute -top-1.5 flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-red-500",
            userStore.isRtl ? "-left-1.5" : "-right-1.5",
          )}
        >
          <StarIcon size={12} fill="white" color="white" />
        </span>
      )}
    </button>
  );
}
