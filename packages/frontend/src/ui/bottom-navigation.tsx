import { type ReactNode } from "preact/compat";
import leaderboardIcon from "../assets/bottom-navigation/leaderboard.webp?no-inline";
import mainIcon from "../assets/bottom-navigation/main.webp?no-inline";
import reviewIcon from "../assets/bottom-navigation/review.webp?no-inline";
import settingsIcon from "../assets/bottom-navigation/settings.webp?no-inline";
import {
  bottomNavigationStore,
  type BottomNavigationTab,
} from "../store/bottom-navigation-store.ts";
import { useDevMenuReveal } from "../screens/dev-menu/use-dev-menu-reveal.tsx";
import { BrowserMainButton } from "../screens/shared/browser-platform/browser-main-button.tsx";
import { t, type StringTranslationKey } from "../translations/t.ts";
import { cn } from "./cn.ts";

const navigationItems: ReadonlyArray<{
  id: BottomNavigationTab;
  icon: string;
  labelKey: StringTranslationKey;
}> = [
  {
    id: "main",
    icon: mainIcon,
    labelKey: "navigation_main",
  },
  {
    id: "review",
    icon: reviewIcon,
    labelKey: "navigation_review",
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
    <div className="grid h-16 grid-cols-4 bg-[#f2f2f2] px-1 pb-1 dark:bg-bg">
      {navigationItems.map((item) => {
        const isActive = item.id === activeTab;

        return (
          <button
            type="button"
            title={t(item.labelKey)}
            key={item.id}
            className={cn(
              "relative flex min-w-0 flex-col items-center justify-center gap-0.5 text-[0.625rem] font-medium text-hint",
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
  const { handleMainTap, devMenu } = useDevMenuReveal();

  function handleSelect(tab: BottomNavigationTab) {
    if (tab === "main") {
      handleMainTap();
    }

    bottomNavigationStore.navigate(tab);
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col",
        isVisible &&
          "[--bottom-navigation-inset:max(0px,calc(var(--app-bottom-inset)_-_1rem))] [[data-platform=telegram]_&]:[--bottom-navigation-inset:var(--app-bottom-inset)] [--app-bottom-control-offset:calc(4rem_+_var(--bottom-navigation-inset)_+_var(--app-bottom-control-gap))]",
      )}
    >
      <div
        className={cn(
          "relative min-h-0 flex-1",
          isVisible && "[--app-route-bottom-inset:0px]",
        )}
      >
        {children}
      </div>
      {isVisible ? (
        <div className="pb-[var(--bottom-navigation-inset)] z-30 shrink-0 border-t border-black/[0.12] bg-[#f2f2f2] dark:border-white/[0.12] dark:bg-bg">
          <BottomNavigationView activeTab={activeTab} onSelect={handleSelect} />
        </div>
      ) : null}
      <BrowserMainButton />
      {devMenu}
    </div>
  );
}
