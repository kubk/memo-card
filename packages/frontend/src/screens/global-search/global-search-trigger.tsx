import { SearchIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { cn } from "../../ui/cn";
import { screenStore } from "../../store/screen-store";
import { deckListStore } from "../../store/deck-list-store";
import { t } from "../../translations/t";

export const GlobalSearchTrigger = observer(() => {
  const hasAnyDecks =
    deckListStore.myInfo && deckListStore.myDeckItems.length > 0;

  if (!hasAnyDecks) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[4px] relative">
      <button
        className={cn(
          "flex py-2.5 px-2.5 text-base border-2 border-solid border-secondary-bg rounded-xl bg-bg w-full ps-10",
        )}
        onClick={() => screenStore.go({ type: "globalSearch" })}
      >
        <span className={cn("absolute top-[14px] text-hint start-[12px]")}>
          <SearchIcon size={18} />
        </span>
        <span className="text-hint">{t("global_search_placeholder")}</span>
      </button>
    </div>
  );
});
