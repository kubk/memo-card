import { type ReactNode } from "react";
import leaderboardIcon from "../assets/bottom-navigation/leaderboard.webp";
import mainIcon from "../assets/bottom-navigation/main.webp";
import reviewIcon from "../assets/bottom-navigation/review.webp";
import settingsIcon from "../assets/bottom-navigation/settings.webp";
import {
  bottomNavigationStore,
  type BottomNavigationTab,
} from "../store/bottom-navigation-store.ts";
import { t, type TranslationKey } from "../translations/t.ts";
import { cn } from "./cn.ts";

const navigationItems: ReadonlyArray<{
  id: BottomNavigationTab;
  icon: string;
  labelKey: TranslationKey;
}> = [
  {
    id: "main",
    icon: mainIcon,
    labelKey: "navigation_main",
  },
  {
    id: "leaderboard",
    icon: leaderboardIcon,
    labelKey: "leaderboard",
  },
  {
    id: "settings",
    icon: settingsIcon,
    labelKey: "settings",
  },
  {
    id: "review",
    icon: reviewIcon,
    labelKey: "navigation_review",
  },
];

function NavigationIcon({ src }: { src: string }) {
  return (
    <span
      className="size-5 bg-current"
      style={{
        maskImage: `url(${src})`,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

export function BottomNavigationView({
  activeTab,
  onSelect,
}: {
  activeTab: BottomNavigationTab;
  onSelect: (tab: BottomNavigationTab) => void;
}) {
  return (
    <div className="grid h-[64px] grid-cols-4 bg-[#f2f2f2] px-1 pb-1 dark:bg-bg">
      {navigationItems.map((item) => {
        const isActive = item.id === activeTab;

        return (
          <button
            type="button"
            title={t(item.labelKey)}
            key={item.id}
            className={cn(
              "relative flex min-w-0 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-hint",
              isActive && "font-semibold text-button",
            )}
            onClick={() => onSelect(item.id)}
          >
            <NavigationIcon src={item.icon} />
            <span className="max-w-full truncate px-0.5">
              {t(item.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function BottomNavigation({ children }: { children: ReactNode }) {
  const activeTab = bottomNavigationStore.activeTab;
  const isVisible = bottomNavigationStore.isVisible && activeTab !== null;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative min-h-0 flex-1">{children}</div>
      {isVisible ? (
        <div className="z-30 shrink-0 border-t border-black/[0.12] bg-[#f2f2f2] pb-[var(--tg-safe-area-inset-bottom,0px)] dark:border-white/[0.12] dark:bg-bg">
          <BottomNavigationView
            activeTab={activeTab}
            onSelect={bottomNavigationStore.navigate}
          />
        </div>
      ) : null}
    </div>
  );
}
