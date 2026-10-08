import { type ButtonHTMLAttributes, type ReactNode } from "preact/compat";
import { cn } from "./cn.ts";
import { DropdownOrVault } from "./dropdown-or-vault.tsx";
import { type DropdownItem } from "./dropdown.tsx";
import { Skeleton } from "./skeleton.tsx";

const actionTileClassName =
  "flex h-[72px] w-full min-w-0 flex-1 flex-col items-center justify-center gap-1.5 bg-bg px-1 text-xs text-button select-none transition-colors duration-200 ease-in-out";

function ActionTileContent({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <>
      {icon}
      <span className="max-w-full truncate">{text}</span>
    </>
  );
}

export type ActionTileRowItem =
  | {
      type: "action";
      icon: ReactNode;
      text: string;
      onClick: () => void;
      disabled?: boolean;
      className?: string;
    }
  | {
      type: "stat";
      value: number;
      text: string;
      isLoading?: boolean;
      textClassName?: string;
      valueClassName?: string;
      onClick?: () => void;
    }
  | {
      type: "dropdown";
      icon: ReactNode;
      text: string;
      options: DropdownItem[];
    };

export function ActionTileRow({
  items,
  className,
}: {
  items: ActionTileRowItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0",
        "[&>*:first-child]:rounded-s-xl [&>*:last-child]:rounded-e-xl",
        "[&>*:first-child>*]:rounded-s-xl [&>*:last-child>*]:rounded-e-xl",
        className,
      )}
    >
      {items.map((item, i) => {
        if (item.type === "stat") {
          return (
            <ActionTileStat
              key={i}
              value={item.value}
              text={item.text}
              isLoading={item.isLoading}
              textClassName={item.textClassName}
              valueClassName={item.valueClassName}
              onClick={item.onClick}
            />
          );
        }

        if (item.type === "dropdown") {
          return (
            <DropdownOrVault
              key={i}
              className="relative min-w-0 flex-1"
              triggerClassName={cn(
                actionTileClassName,
                "active:bg-button-alpha-20",
              )}
              trigger={<ActionTileContent icon={item.icon} text={item.text} />}
              options={item.options}
            />
          );
        }

        return (
          <ActionTileIcon
            key={i}
            icon={item.icon}
            text={item.text}
            onClick={item.onClick}
            disabled={item.disabled}
            className={item.className}
          />
        );
      })}
    </div>
  );
}

type Props = {
  icon: ReactNode;
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function ActionTileIcon({ icon, text, className, ...restProps }: Props) {
  return (
    <button
      {...restProps}
      className={cn(
        actionTileClassName,
        "active:bg-button-alpha-20",
        "disabled:cursor-not-allowed disabled:text-disabled",
        "disabled:active:bg-bg",
        className,
      )}
    >
      <div className="flex w-full min-w-0 flex-col items-center gap-1.5">
        <ActionTileContent icon={icon} text={text} />
      </div>
    </button>
  );
}

type StatProps = {
  value: number;
  text: string;
  isLoading?: boolean;
  textClassName?: string;
  valueClassName?: string;
  onClick?: () => void;
};

function ActionTileStat({
  value,
  text,
  isLoading,
  textClassName,
  valueClassName,
  onClick,
}: StatProps) {
  const isDisabled = value === 0 && !isLoading;

  const content = (
    <div className="flex w-full min-w-0 flex-col items-center gap-1.5">
      {isLoading ? (
        <Skeleton className="h-6 w-7 rounded" />
      ) : (
        <span
          className={cn(
            "text-2xl font-bold leading-none",
            valueClassName,
            isDisabled && "text-disabled",
          )}
        >
          {value}
        </span>
      )}
      <span
        className={cn(
          "max-w-full truncate",
          textClassName,
          isDisabled && "text-disabled",
        )}
      >
        {text}
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={cn(
          actionTileClassName,
          "active:bg-button-alpha-20",
          "disabled:cursor-not-allowed disabled:text-disabled",
          "disabled:active:bg-bg",
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cn(actionTileClassName, "pointer-events-none")}>
      {content}
    </div>
  );
}
