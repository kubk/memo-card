import { cn } from "../../ui/cn.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import { t } from "../../translations/t.ts";
import { platform } from "../../lib/platform/platform.ts";

export function ViewMoreDecksToggle() {
  return (
    <button
      className={cn(
        "text-link text-sm uppercase flex shrink-0 items-center gap-1",
      )}
      onClick={() => {
        platform.haptic("selection");
        deckListStore.isMyDecksExpanded.toggle();
      }}
    >
      <span className="focus:outline-hidden">
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
