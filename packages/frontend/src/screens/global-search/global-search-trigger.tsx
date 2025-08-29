import { SearchIcon } from "lucide-react";
import { cn } from "../../ui/cn";
import { screenStore } from "../../store/screen-store";
import { deckListStore } from "../../store/deck-list-store";
import { t } from "../../translations/t";

export function GlobalSearchTrigger() {
  const isEmptyDecks =
    deckListStore.isAppLoading && deckListStore.myDeckItems.length === 0;

  if (isEmptyDecks) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[4px] relative">
      <button
        className={cn(
          "flex py-2.5 px-2.5 text-base border-2 border-solid border-secondary-bg rounded-xl bg-bg w-full ps-10",
        )}
        disabled={deckListStore.isAppLoading}
        onClick={() => screenStore.go({ type: "globalSearch" })}
      >
        <span className={cn("absolute top-[14px] text-hint start-[12px]")}>
          <SearchIcon size={18} />
        </span>
        <span className="text-hint">{t("global_search_placeholder")}</span>
      </button>
    </div>
  );
}
