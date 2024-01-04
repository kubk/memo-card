import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import React, { useState } from "react";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { SettingsRow } from "../user-settings/settings-row.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { Input } from "../../ui/input.tsx";
import { Label } from "../../ui/label.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useTelegramProgress } from "../../lib/telegram/use-telegram-progress.tsx";
import { ShareDeckStore } from "./share-deck-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { DateTime } from "luxon";
import { theme } from "../../ui/theme.tsx";
import { getDeckLink } from "./redirect-user-to-deck-link.tsx";
import { showAlert } from "../../lib/telegram/show-alert.ts";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";

export const ShareDeck = observer(() => {
  const [store] = useState(() => new ShareDeckStore());

  useBackButton(() => {
    screenStore.back();
  });

  useMount(() => {
    store.load();
  });

  useMainButton(
    () => {
      return store.form.isOneTime.value
        ? "Share one-time link"
        : "Share perpetual link";
    },
    () => {
      store.shareDeck();
    },
    () => store.isSaveButtonVisible,
  );

  useTelegramProgress(() => store.isSending);

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
      <h3 className={css({ textAlign: "center" })}>Share deck settings</h3>
      <SettingsRow>
        <span>One-time access link</span>
        <RadioSwitcher
          isOn={store.form.isOneTime.value}
          onToggle={store.form.isOneTime.toggle}
        />
      </SettingsRow>
      <HintTransparent marginTop={-12}>
        After the recipient accesses the deck with this link, it becomes
        invalid, preventing further shares
      </HintTransparent>
      {store.form.isOneTime.value && (
        <>
          <SettingsRow>
            <span>Access duration</span>
            <RadioSwitcher
              isOn={store.form.isAccessDuration.value}
              onToggle={store.form.isAccessDuration.toggle}
            />
          </SettingsRow>
        </>
      )}
      {store.form.isOneTime.value && store.form.isAccessDuration.value && (
        <Label text={"Days"}>
          <Input field={store.form.accessDurationLimitDays} />
          <HintTransparent>
            How long the deck will be available after the first use
          </HintTransparent>
        </Label>
      )}
      {store.form.isOneTime.value && store.form.isAccessDuration.value && (
        <Label text={"Previous links statistics"}>
          {store.deckAccesses?.state === "pending" ? (
            <div className={css({ width: "100%", textAlign: "center" })}>
              <i className={"mdi mdi-loading mdi-spin mdi-24px"} />
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
                      borderTop: "1px solid #ccc",
                    })}
                  >
                    <div>
                      <div
                        className={css({
                          fontWeight: 500,
                        })}
                      >
                        #{access.id}:{" "}
                        {access.used_by
                          ? "Have been used ✅"
                          : `Haven't been used ❌`}
                        <span
                          onClick={async () => {
                            const link = getDeckLink(access.share_id);
                            await copyToClipboard(link);
                            showAlert(
                              "The link has been copied to your clipboard",
                            );
                          }}
                          className={css({
                            color: theme.linkColor,
                            cursor: "pointer",
                          })}
                        >
                          {" "}
                          Copy link
                        </span>
                      </div>
                      <div>
                        Access duration days:{" "}
                        {access.duration_days ?? <i>None</i>}
                      </div>
                      <div>
                        Created at:{" "}
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
        </Label>
      )}
    </div>
  );
});
