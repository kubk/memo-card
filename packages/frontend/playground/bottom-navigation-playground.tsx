import { useState } from "react";
import { type BottomNavigationTab } from "../src/store/bottom-navigation-store.ts";
import { BottomNavigationView } from "../src/ui/bottom-navigation.tsx";

export function BottomNavigationPlayground() {
  const [activeTab, setActiveTab] = useState<BottomNavigationTab>("main");

  return (
    <div className="flex h-full w-full items-end justify-center bg-secondary-bg text-text">
      <div className="w-full max-w-[390px] border-t border-black/[0.12] dark:border-white/[0.12]">
        <BottomNavigationView activeTab={activeTab} onSelect={setActiveTab} />
      </div>
    </div>
  );
}
