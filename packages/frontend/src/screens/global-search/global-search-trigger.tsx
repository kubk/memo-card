import { SearchIcon } from "lucide-react";
import { screenStore } from "../../store/screen-store";
import { deckListStore } from "../../store/deck-list-store";
import { appLoaderStore } from "../../store/app-loader-store";
import { t } from "../../translations/t";

export function GlobalSearchTrigger() {
  const isEmptyDecks =
    appLoaderStore.isAppLoading && deckListStore.myDeckItems.length === 0;

  if (isEmptyDecks) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 relative">
      <button
        className="flex py-2.5 px-2.5 text-base border-2 border-solid border-secondary-bg rounded-xl bg-bg w-full ps-10"
        disabled={appLoaderStore.isAppLoading}
        onClick={() => screenStore.push({ type: "globalSearch" })}
      >
        <span className="absolute top-3.5 text-hint start-3">
          <SearchIcon className="size-4.5" />
        </span>
        <span className="min-w-0 truncate text-hint">
          {t("global_search_placeholder")}
        </span>
      </button>
    </div>
  );
}
