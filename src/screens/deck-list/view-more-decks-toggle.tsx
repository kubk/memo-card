import { observer } from "mobx-react-lite";
import { cn } from "../../ui/cn.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import { t } from "../../translations/t.ts";
import { userStore } from "../../store/user-store.ts";

export const ViewMoreDecksToggle = observer(() => {
  return (
    <button
      className={cn(
        "absolute top-2 text-link text-sm uppercase flex items-center gap-1",
        userStore.isRtl ? "left-3" : "right-3",
      )}
      onClick={deckListStore.isMyDecksExpanded.toggle}
    >
      <span
        className="focus:outline-none"
        style={{
          transform: "translateY(2px)",
        }}
      >
        <ChevronIcon
          direction={deckListStore.isMyDecksExpanded.value ? "top" : "bottom"}
        />
      </span>
      {deckListStore.isMyDecksExpanded.value
        ? t("hide_all_decks")
        : t("show_all_decks")}
    </button>
  );
});
