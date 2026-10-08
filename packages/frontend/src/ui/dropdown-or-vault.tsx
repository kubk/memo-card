import { type ReactNode, useEffect, useState } from "preact/compat";
import { createPortal } from "preact/compat";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { EllipsisIcon } from "lucide-react";
import { platform } from "../lib/platform/platform.ts";
import { t } from "../translations/t.ts";
import { cn } from "./cn.ts";
import { overlayStore } from "../store/overlay-store.ts";
import { useMount } from "../lib/react/use-mount.ts";
import { Dropdown, type DropdownItem } from "./dropdown.tsx";

type Props = {
  options: DropdownItem[];
  className?: string;
  trigger?: ReactNode;
  triggerClassName?: string;
  placement?: "down" | "up";
};

function ActionMenuOverlay({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  useMount(() => {
    overlayStore.add();
    return () => overlayStore.remove();
  });

  return (
    <>
      <m.div
        className="fixed inset-0 z-[1001] bg-black/50 touch-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
        }}
        exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }}
        onClick={onClose}
      />
      <m.div
        role="dialog"
        className="fixed inset-x-3 bottom-0 z-[1002] max-h-[calc(var(--app-viewport-height)_-_var(--app-safe-area-top)_-_var(--app-content-safe-area-top))] overflow-y-auto overscroll-contain pb-[calc(var(--app-bottom-inset)_+_12px)] text-text will-change-transform"
        initial={{ y: "100%" }}
        animate={{
          y: 0,
          transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
        }}
        exit={{
          y: "100%",
          transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
        }}
      >
        <h2 className="sr-only">{t("more")}</h2>
        {children}
      </m.div>
    </>
  );
}

function ActionMenu({
  options,
  className,
  trigger,
  triggerClassName,
}: Omit<Props, "placement">) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

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
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <ActionMenuOverlay onClose={close}>
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
                      index !== options.length - 1 &&
                        "border-b border-secondary-bg",
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
            </ActionMenuOverlay>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

export function DropdownOrVault({ options, ...props }: Props) {
  if (platform.isMobile) {
    return <ActionMenu options={options} {...props} />;
  }

  return <Dropdown items={options} {...props} />;
}
