import { globalSearchStore } from "./global-search-store.ts";
import { SearchResults } from "./search-results.tsx";
import { Input } from "../../ui/input.tsx";
import { CircleXIcon, SearchIcon } from "lucide-react";
import { Flex } from "../../ui/flex.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { AppTabs } from "../../ui/app-tabs.tsx";
import { Badge } from "../../ui/badge.tsx";
import { userStore } from "../../store/user-store.ts";
import { cn } from "../../ui/cn.ts";
import { t } from "../../translations/t.ts";

export function SearchScreen() {
  useBackButton(() => {
    screenStore.back();
    globalSearchStore.clearSearch();
  });

  return (
    <Flex direction="column" pb={48}>
      <div className="sticky top-0 bg-secondary-bg z-10 pb-1">
        <div className="flex items-center pb-3 gap-2">
          <div className="flex-1">
            <Input
              field={globalSearchStore.searchQuery}
              mainIcon={<SearchIcon size={18} />}
              autoFocus
              secondaryIcon={
                globalSearchStore.isSearchActive ? (
                  <button onClick={() => globalSearchStore.clearSearch()}>
                    <CircleXIcon size={18} className="text-hint" />
                  </button>
                ) : null
              }
              placeholder={t("search_card")}
            />
          </div>

          <button
            onClick={() => screenStore.back()}
            className="text-link whitespace-nowrap"
            aria-label="Cancel search"
          >
            {t("global_search_cancel")}
          </button>
        </div>
        {globalSearchStore.isSearchActive && globalSearchStore.hasResults && (
          <AppTabs
            tabs={globalSearchStore.tabs.map((tab) => ({
              ...tab,
              title: (
                <div
                  className={cn(
                    "flex items-center gap-2",
                    userStore.isRtl && "flex-row-reverse",
                  )}
                >
                  <span>{tab.title}</span>
                  <Badge
                    variant={
                      tab.value === globalSearchStore.activeTab
                        ? "default"
                        : tab.disabled
                        ? "disabled"
                        : "secondary"
                    }
                  >
                    {tab.count}
                  </Badge>
                </div>
              ),
            }))}
            value={globalSearchStore.activeTab || undefined}
            onChange={globalSearchStore.setActiveTab}
            className="mb-2"
          />
        )}
      </div>

      <SearchResults />

      {!globalSearchStore.isSearchActive && (
        <div className="text-center text-hint">
          {t("global_search_start_typing")}
        </div>
      )}
    </Flex>
  );
}
