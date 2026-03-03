import { cn } from "../../ui/cn.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import { t } from "../../translations/t.ts";
import { platform } from "../../lib/platform/platform.ts";

export function ViewMoreDecksToggle() {
  return (
    <button
      className={cn(
        "absolute top-1 text-link text-sm uppercase flex items-center gap-1 end-3",
      )}
      onClick={() => {
        platform.haptic("selection");
        deckListStore.isMyDecksExpanded.toggle();
      }}
    >
      <span className="focus:outline-none">
        <ChevronIcon
          direction={deckListStore.isMyDecksExpanded.value ? "top" : "bottom"}
        />
      </span>
      {deckListStore.isMyDecksExpanded.value
        ? t("hide_all_decks")
        : t("show_all_decks")}
    </button>
  );
}
