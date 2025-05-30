import { cn } from "./cn.ts";

type Props = {
  mainColor?: string;
  noPseudoClasses?: boolean;
  column?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function UpgradeButton(props: Props) {
  const { className, children, column, ...restProps } = props;

  return (
    <button
      {...restProps}
      className={cn(
        "flex w-full justify-center items-center cursor-pointer text-button-text font-semibold text-[14px] leading-normal py-3 px-3 select-none transition-colors duration-200 ease-in-out rounded-[12px]",
        column ? "flex-col gap-0" : "gap-2",
        className,
      )}
      style={{
        backgroundImage: "linear-gradient(to right, #8b5cf6, #ec4899, #ef4444)",
      }}
    >
      {children}
    </button>
  );
}
