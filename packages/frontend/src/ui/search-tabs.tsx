import { type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "./shadcn/tabs.tsx";
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

  return (
    <Tabs
      className={className}
      value={value}
      onValueChange={(newValue: string) => {
        onChange?.(newValue as T);
      }}
    >
      <TabsList
        className={cn(
          "flex w-full bg-bg p-[3px] text-hint",
          isRtl && "flex-row-reverse",
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            className="h-[calc(100%-1px)] flex-1 gap-1.5 border border-transparent px-2 text-text data-[state=active]:bg-button-outline-bg-light data-[state=active]:text-button-outline-fg-light dark:text-hint dark:data-[state=active]:bg-button-outline-bg-dark dark:data-[state=active]:text-button-outline-fg-dark"
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
