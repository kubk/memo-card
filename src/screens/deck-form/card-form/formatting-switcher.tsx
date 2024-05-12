import { observer } from "mobx-react-lite";
import { userStore } from "../../../store/user-store.ts";
import { css, cx } from "@emotion/css";
import { reset } from "../../../ui/reset.ts";
import { theme } from "../../../ui/theme.tsx";
import { ChevronIcon } from "../../../ui/chevron-icon.tsx";
import { t } from "../../../translations/t.ts";
import React from "react";

export const FormattingSwitcher = observer(() => {
  return (
    <button
      onClick={() => {
        userStore.isCardFormattingOn.toggle();
      }}
      className={cx(
        reset.button,
        css({
          fontSize: 16,
          color: theme.linkColor,
          cursor: "pointer",
        }),
      )}
    >
      <span
        className={css({
          transform: "translateY(2px)",
          display: "inline-block",
        })}
      >
        {" "}
        <ChevronIcon
          direction={userStore.isCardFormattingOn.value ? "top" : "bottom"}
        />
      </span>{" "}
      {t("formatting")}
    </button>
  );
});
