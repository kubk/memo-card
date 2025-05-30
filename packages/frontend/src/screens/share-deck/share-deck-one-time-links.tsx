import { t } from "../../translations/t.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { getDeckOrFolderLink } from "./share-memo-card-url.tsx";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { DateTime } from "luxon";
import { useShareDeckStore } from "./store/share-deck-store-context.tsx";
import { Screen } from "../shared/screen.tsx";
import { Loader } from "../../ui/loader.tsx";
import { EmptyState } from "../../ui/empty-state.tsx";
import { formatAccessUser } from "./format-access-user.ts";
import { notifySuccess } from "../shared/snackbar/snackbar.tsx";
import { cn } from "../../ui/cn.ts";

export function ShareDeckOneTimeLinks() {
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
                className={cn(
                  "pt-1.5 ml-3",
                  i !== 0 &&
                    "border-t border-divider dark:border-separator-dark",
                )}
              >
                <div>
                  <div className="font-medium">
                    #{access.id}{" "}
                    <span
                      onClick={async () => {
                        const link = getDeckOrFolderLink(access.share_id);
                        await copyToClipboard(link);
                        notifySuccess(t("share_link_copied"));
                      }}
                      className={cn("text-link", "cursor-pointer")}
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
}
