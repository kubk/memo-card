import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { t } from "../../translations/t.ts";
import React from "react";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { getDeckOrFolderLink } from "./redirect-user-to-deck-or-folder-link.tsx";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { showAlert } from "../../lib/platform/show-alert.ts";
import { theme } from "../../ui/theme.tsx";
import { DateTime } from "luxon";
import { useShareDeckStore } from "./store/share-deck-store-context.tsx";
import { Screen } from "../shared/screen.tsx";
import { Loader } from "../../ui/loader.tsx";
import { EmptyState } from "../../ui/empty-state.tsx";
import { formatAccessUser } from "./format-access-user.ts";

export const ShareDeckOneTimeLinks = observer(() => {
  const store = useShareDeckStore();

  useBackButton(() => {
    store.isDeckAccessesOpen.setFalse();
  });

  useMount(() => {
    store.load();
  });

  const deckAccesses = store.deckAccessesRequest.result;

  return (
    <Screen title={t("share_one_time_links_usage")}>
      {deckAccesses.status === "loading" ? <Loader /> : null}
      {deckAccesses.status === "success" &&
      deckAccesses.data.accesses.length === 0 ? (
        <EmptyState>
          {store.deckAccessType === "deck"
            ? t("share_no_links")
            : t("share_no_links_for_folder")}
        </EmptyState>
      ) : null}

      {store.deckAccessesRequest.result.status === "success"
        ? store.deckAccessesRequest.result.data.accesses.map((access, i) => {
            return (
              <div
                key={i}
                className={css({
                  paddingTop: 6,
                  marginLeft: 12,
                  borderTop: i !== 0 ? `1px solid ${theme.divider}` : undefined,
                })}
              >
                <div>
                  <div
                    className={css({
                      fontWeight: 500,
                    })}
                  >
                    #{access.id}{" "}
                    <span
                      onClick={async () => {
                        const link = getDeckOrFolderLink(access.share_id);
                        await copyToClipboard(link);
                        showAlert(t("share_link_copied"));
                      }}
                      className={css({
                        color: theme.linkColor,
                        cursor: "pointer",
                      })}
                    >
                      {t("share_copy_link")}
                    </span>
                  </div>
                  <div>
                    {access.used_by && access.user
                      ? `${t("share_used")} ${formatAccessUser(access.user)}`
                      : t("share_unused")}
                  </div>
                  <div>
                    {t("share_access_duration_days")}:{" "}
                    {access.duration_days ?? (
                      <i>{t("share_access_duration_no_limit")}</i>
                    )}
                  </div>
                  <div>
                    {t("share_deck_access_created_at")}:{" "}
                    {DateTime.fromISO(access.created_at).toLocaleString({
                      year: "2-digit",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </Screen>
  );
});
