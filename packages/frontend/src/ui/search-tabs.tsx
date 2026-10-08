import { type ReactNode, useState } from "preact/compat";
import { userStore } from "../store/user-store";
import { cn } from "./cn";

type TabItem<T extends string> = {
  title: ReactNode;
  value: T;
  disabled?: boolean;
};

type TabsProps<T extends string> = {
  tabs: Array<TabItem<T>>;
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
};

export function SearchTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  const isRtl = userStore.isRtl;
  const [selectedValue, setSelectedValue] = useState<T | undefined>(value);
  const activeValue = value ?? selectedValue;

  const select = (nextValue: T) => {
    setSelectedValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div className={className}>
      <div
        className={cn(
          "flex h-9 w-full items-center justify-center rounded-lg bg-bg p-[3px] text-hint",
          isRtl && "flex-row-reverse",
        )}
      >
        {tabs.map((tab) => (
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md py-1 text-sm font-medium transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-button disabled:pointer-events-none disabled:opacity-50 h-[calc(100%-1px)] flex-1 gap-1.5 border border-transparent px-2 text-text data-[state=active]:bg-button-outline-bg-light data-[state=active]:text-button-outline-fg-light dark:text-hint dark:data-[state=active]:bg-button-outline-bg-dark dark:data-[state=active]:text-button-outline-fg-dark"
            key={tab.value}
            type="button"
            data-state={activeValue === tab.value ? "active" : "inactive"}
            tabIndex={activeValue === tab.value || !activeValue ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => select(tab.value)}
            onKeyDown={(event) => {
              const enabledTabs = tabs.filter((item) => !item.disabled);
              const index = enabledTabs.findIndex(
                (item) => item.value === tab.value,
              );
              let nextIndex: number;
              switch (event.key) {
                case "ArrowRight":
                  nextIndex = index + (isRtl ? -1 : 1);
                  break;
                case "ArrowLeft":
                  nextIndex = index + (isRtl ? 1 : -1);
                  break;
                case "Home":
                  nextIndex = 0;
                  break;
                case "End":
                  nextIndex = enabledTabs.length - 1;
                  break;
                default:
                  return;
              }
              event.preventDefault();
              const nextTab =
                enabledTabs[
                  (nextIndex + enabledTabs.length) % enabledTabs.length
                ];
              if (nextTab) {
                select(nextTab.value);
                const buttons =
                  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                    "button:not(:disabled)",
                  );
                buttons?.[
                  (nextIndex + enabledTabs.length) % enabledTabs.length
                ]?.focus();
              }
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>
    </div>
  );
}
