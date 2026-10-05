import { useState } from "react";
import { type PaidPlanType } from "api";
import { Drawer } from "../../ui/drawer.tsx";
import { List } from "../../ui/list.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { Select } from "../../ui/select.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { userStore } from "../../store/user-store.ts";
import { DevMenuStore } from "./dev-menu-store.ts";

type DevPlanOption = "none" | PaidPlanType;

const devPlanOptions: Array<{ value: DevPlanOption; label: string }> = [
  { value: "none", label: "Not paid" },
  { value: "pro", label: "Pro" },
  { value: "teacher", label: "Teacher" },
];

export function DevMenu({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const [store] = useState(() => new DevMenuStore());

  return (
    <Drawer
      defaultOpen
      onOpenChange={onOpenChange}
      title="Developer tools"
      titleClassName="mb-4 text-center text-lg font-semibold"
    >
      <List
        animateTap={false}
        items={[
          {
            right: (
              <span className="relative top-[3px]">
                <RadioSwitcher
                  isOn={userStore.isSkipReview.value}
                  onToggle={userStore.isSkipReview.toggle}
                />
              </span>
            ),
            text: "Skip review",
          },
          {
            right: (
              <div className="text-link">
                <Select
                  value={store.planValue}
                  onChange={(value) => {
                    store.setDevPlan(value === "none" ? null : value);
                  }}
                  options={devPlanOptions}
                />
              </div>
            ),
            text: "Plan",
          },
          {
            right: (
              <span className="relative top-[3px]">
                <RadioSwitcher
                  isOn={store.isErudaEnabled.value}
                  onToggle={store.isErudaEnabled.toggle}
                />
              </span>
            ),
            text: "Eruda console",
          },
          {
            text: "Open deck not found",
            onClick: () => {
              onOpenChange(false);
              screenStore.push({ type: "sharedDeckNotFound" });
            },
          },
        ]}
      />
    </Drawer>
  );
}
