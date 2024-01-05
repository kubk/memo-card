import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { t } from "../../translations/t.ts";
import React from "react";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useMount } from "../../lib/react/use-mount.ts";
import { getDeckLink } from "./redirect-user-to-deck-link.tsx";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { showAlert } from "../../lib/telegram/show-alert.ts";
import { theme } from "../../ui/theme.tsx";
import { DateTime } from "luxon";
import { useShareDeckStore } from "./store/share-deck-store-context.tsx";

export const ShareDeckOneTimeLinks = observer(() => {
  const store = useShareDeckStore();

  useBackButton(() => {
    store.isDeckAccessesOpen.setFalse();
  });

  useMount(() => {
    store.load();
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginBottom: 16,
        position: "relative",
      })}
    >
      <h3 className={css({ textAlign: "center" })}>
        {t("share_one_time_links_usage")}
      </h3>

      {store.deckAccesses?.state === "pending" ? (
        <div className={css({ width: "100%", textAlign: "center" })}>
          <i className={"mdi mdi-loading mdi-spin mdi-24px"} />
        </div>
      ) : null}

      {store.deckAccesses?.state === "fulfilled" &&
      store.deckAccesses.value.accesses.length === 0 ? (
        <div
          className={css({
            width: "100%",
            textAlign: "center",
            marginTop: 8,
            fontSize: 14,
          })}
        >
          {t("share_no_links")}
        </div>
      ) : null}

      {store.deckAccesses?.state === "fulfilled"
        ? store.deckAccesses.value.accesses.map((access, i) => {
            return (
              <div
                key={i}
                className={css({
                  paddingTop: 6,
                  marginLeft: 12,
                  borderTop: i !== 0 ? "1px solid #ccc" : undefined,
                })}
              >
                <div>
                  <div
                    className={css({
                      fontWeight: 500,
                    })}
                  >
                    #{access.id}:{" "}
                    {access.used_by ? t("share_used") : t("share_unused")}
                    <span
                      onClick={async () => {
                        const link = getDeckLink(access.share_id);
                        await copyToClipboard(link);
                        showAlert(t("share_link_copied"));
                      }}
                      className={css({
                        color: theme.linkColor,
                        cursor: "pointer",
                      })}
                    >
                      {" "}
                      {t("share_copy_link")}
                    </span>
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
    </div>
  );
});
