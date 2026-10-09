import { useState } from "preact/compat";
import { type PaidPlanType } from "api";
import { Chip } from "../../ui/chip.tsx";
import { Drawer } from "../../ui/drawer.tsx";
import { List } from "../../ui/list.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { LoadingSwap } from "../../ui/loading-swap.tsx";
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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && store.pendingPlan !== null) {
          return;
        }

        setIsOpen(open);
        onOpenChange(open);
      }}
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
              <div className="flex gap-1">
                {devPlanOptions.map(({ value, label }) => (
                  <Chip
                    key={value}
                    isSelected={store.planValue === value}
                    onClick={() =>
                      store.setDevPlan(value === "none" ? null : value)
                    }
                  >
                    <LoadingSwap isLoading={store.pendingPlan === value}>
                      {label}
                    </LoadingSwap>
                  </Chip>
                ))}
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
