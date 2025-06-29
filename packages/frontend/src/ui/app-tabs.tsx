import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
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

export const AppTabs = <T extends string>(props: TabsProps<T>) => {
  const { tabs, value, onChange, className } = props;

  const isRtl = userStore.isRtl;

  return (
    <Tabs
      className={className}
      value={value}
      onValueChange={(newValue: string) => {
        onChange?.(newValue as T);
      }}
    >
      <TabsList className={cn("flex w-full", isRtl && "flex-row-reverse")}>
        {tabs.map((tab) => (
          <TabsTrigger
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
};
