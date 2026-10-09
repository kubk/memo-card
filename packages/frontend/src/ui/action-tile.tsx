import { type ReactNode } from "preact/compat";
import { cn } from "./cn.ts";
import { DropdownOrVault } from "./dropdown-or-vault.tsx";
import { type DropdownItem } from "./dropdown.tsx";
import { Skeleton } from "./skeleton.tsx";

function ActionTile({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const tileClassName = cn(
    "flex h-[72px] w-full min-w-0 flex-1 flex-col items-center justify-center gap-1.5 bg-bg px-1 text-xs text-button select-none transition-colors duration-200 ease-in-out",
    onClick
      ? "cursor-pointer active:bg-action-tile-active disabled:cursor-not-allowed disabled:text-disabled disabled:active:bg-bg"
      : "pointer-events-none",
    className,
  );
  const content = (
    <div className="flex w-full min-w-0 flex-col items-center gap-1.5">
      {children}
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} disabled={disabled} className={tileClassName}>
        {content}
      </button>
    );
  }

  return <div className={tileClassName}>{content}</div>;
}

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
              trigger={(onClick) => (
                <ActionTile onClick={onClick}>
                  <ActionTileContent icon={item.icon} text={item.text} />
                </ActionTile>
              )}
              options={item.options}
            />
          );
        }

        return (
          <ActionTile
            key={i}
            onClick={item.onClick}
            disabled={item.disabled}
            className={item.className}
          >
            <ActionTileContent icon={item.icon} text={item.text} />
          </ActionTile>
        );
      })}
    </div>
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

  return (
    <ActionTile onClick={onClick} disabled={isDisabled}>
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
    </ActionTile>
  );
}
