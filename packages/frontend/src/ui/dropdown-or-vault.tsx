import { type ReactNode, useState } from "react";
import { EllipsisIcon } from "lucide-react";
import { platform } from "../lib/platform/platform.ts";
import { t } from "../translations/t.ts";
import { cn } from "./cn.ts";
import { Drawer } from "./drawer.tsx";
import { Dropdown, type DropdownItem } from "./dropdown.tsx";

type Props = {
  options: DropdownItem[];
  className?: string;
  trigger?: ReactNode;
  triggerClassName?: string;
  placement?: "down" | "up";
};

function Vault({
  options,
  className,
  trigger,
  triggerClassName,
}: Omit<Props, "placement">) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    platform.haptic("selection");
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn("inline-block", className)}>
      <button
        onClick={open}
        className={cn(
          "select-none cursor-pointer",
          trigger ? "block w-full" : "dropdown-icon text-hint active:scale-90",
          triggerClassName,
        )}
      >
        {trigger ?? <EllipsisIcon size={24} />}
      </button>
      <Drawer
        open={isOpen}
        autoFocus={false}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            close();
          }
        }}
        title={t("more")}
        titleClassName="sr-only"
        contentProps={{
          showHandle: false,
          overlayStyle: { zIndex: 1001 },
          className:
            "inset-x-3 bottom-3 rounded-[22px] bg-transparent p-0 shadow-none",
          style: { zIndex: 1002 },
        }}
      >
        <div className="overflow-hidden rounded-[22px] bg-bg">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                close();
                option.onClick();
                platform.haptic("selection");
              }}
              className={cn(
                "flex w-full items-center gap-4 bg-bg px-5 py-4 text-left text-[17px] text-text active:bg-secondary-bg",
                index !== options.length - 1 && "border-b border-secondary-bg",
              )}
            >
              <span className="flex w-6 shrink-0 justify-center">
                {option.icon}
              </span>
              <span className="min-w-0 flex-1">{option.text}</span>
            </button>
          ))}
        </div>
        <button
          onClick={close}
          className="mt-2 w-full rounded-[22px] bg-bg py-4 text-[17px] font-semibold text-link active:bg-secondary-bg"
        >
          {t("confirm_cancel")}
        </button>
      </Drawer>
    </div>
  );
}

export function DropdownOrVault({ options, ...props }: Props) {
  if (platform.isMobile) {
    return <Vault options={options} {...props} />;
  }

  return <Dropdown items={options} {...props} />;
}
