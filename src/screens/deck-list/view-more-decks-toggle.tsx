import { observer } from "mobx-react-lite";
import { css, cx } from "@emotion/css";
import { reset } from "../../ui/reset.ts";
import { theme } from "../../ui/theme.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import React from "react";
import { t } from "../../translations/t.ts";
import { userStore } from "../../store/user-store.ts";

export const ViewMoreDecksToggle = observer(() => {
  return (
    <button
      className={cx(
        reset.button,
        css({
          position: "absolute",
          right: !userStore.isRtl ? 12 : undefined,
          left: userStore.isRtl ? 12 : undefined,
          top: 2,
          color: theme.linkColor,
          fontSize: 14,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }),
      )}
      onClick={deckListStore.isMyDecksExpanded.toggle}
    >
      <span className={css({ transform: "translateY(2px)", focus: "none" })}>
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
