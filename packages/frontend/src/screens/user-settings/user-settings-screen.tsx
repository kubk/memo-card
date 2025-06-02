import { useUserSettingsStore } from "./store/user-settings-store-context.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { useEffect } from "react";
import { generateTimeRange } from "./generate-time-range.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { theme } from "../../ui/theme.tsx";
import { Select } from "../../ui/select.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import { links } from "api";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { boolNarrow } from "../../lib/typescript/bool-narrow.ts";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { userStore } from "../../store/user-store.ts";
import { ProIcon } from "../../ui/pro-icon.tsx";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { assert } from "api";
import { showConfirm } from "../../lib/platform/show-confirm.ts";
import { notifyError, notifySuccess } from "../shared/snackbar/snackbar.tsx";
import { languageSharedToHuman, languagesShared } from "api";
import {
  BellIcon,
  ClockIcon,
  SnowflakeIcon,
  MicIcon,
  HeadsetIcon,
  ShieldIcon,
  MailIcon,
  LogOutIcon,
  UserXIcon,
  LanguagesIcon,
} from "lucide-react";

export const timeRanges = generateTimeRange();

export function UserSettingsScreen() {
  const userSettingsStore = useUserSettingsStore();
  const screen = screenStore.screen;
  assert(screen.type === "userSettings");

  useEffect(() => {
    userSettingsStore.load();
  }, [userSettingsStore, screen.index]);

  useMainButton(t("save"), () => userSettingsStore.submit());

  useBackButton(() => {
    screenStore.back();
  });
  useProgress(() => userSettingsStore.userSettingsRequest.isLoading);

  if (!deckListStore.myInfo || !userSettingsStore.form) {
    return null;
  }

  const { isRemindNotifyEnabled, isSpeakingCardsEnabled, time, language } =
    userSettingsStore.form;

  return (
    <Screen title={t("settings")}>
      <div>
        <List
          items={[
            {
              icon: <ProIcon />,
              text: "MemoCard Pro",
              onClick: () => {
                screenStore.go({ type: "plans" });
              },
            },
          ]}
        />

        <HintTransparent>
          {userStore.paidUntil ? (
            <span>
              {t("payment_paid_until")}: {userStore.paidUntil}
            </span>
          ) : (
            t("payment_description")
          )}
        </HintTransparent>
      </div>

      <div className="mt-1">
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.turquoise}
                  icon={<SnowflakeIcon size={18} />}
                />
              ),
              text: t("freeze_title"),
              onClick: () => {
                screenStore.go({ type: "freezeCards" });
              },
            },
          ]}
        />

        <HintTransparent>{t("freeze_hint")}</HintTransparent>
      </div>

      <div className="mt-1">
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.sea}
                  icon={<BellIcon size={18} />}
                />
              ),
              right: (
                <span className="relative top-[3px]">
                  <RadioSwitcher
                    isOn={isRemindNotifyEnabled.value}
                    onToggle={isRemindNotifyEnabled.toggle}
                  />
                </span>
              ),
              text: t("settings_review_notifications"),
            },
            isRemindNotifyEnabled.value
              ? {
                  icon: (
                    <FilledIcon
                      backgroundColor={theme.icons.green}
                      icon={<ClockIcon size={18} />}
                    />
                  ),
                  text: t("settings_time"),
                  right: (
                    <div className="text-link">
                      <Select
                        value={time.value.toString()}
                        onChange={(value) => {
                          time.onChange(value);
                        }}
                        options={timeRanges.map((range) => ({
                          value: range,
                          label: range,
                        }))}
                      />
                    </div>
                  ),
                }
              : null,
          ].filter(boolNarrow)}
        />

        <HintTransparent>
          {t("settings_review_notifications_hint")}
        </HintTransparent>
      </div>

      <div className="mt-1">
        <List
          animateTap={false}
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.pink}
                  icon={<MicIcon size={18} />}
                />
              ),
              right: (
                <span className="relative top-[3px]">
                  <RadioSwitcher
                    isOn={isSpeakingCardsEnabled.value}
                    onToggle={isSpeakingCardsEnabled.toggle}
                  />
                </span>
              ),
              text: t("speaking_cards"),
            },
          ]}
        />

        <HintTransparent>{t("card_speak_description")}</HintTransparent>
      </div>

      <div className="mt-1">
        <List
          items={[
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.violet}
                  icon={<LanguagesIcon size={18} />}
                />
              ),
              text: t("settings_lang"),
              right: (
                <div className="text-link">
                  <Select
                    value={language.value}
                    onChange={(value) => {
                      language.onChange(value);
                    }}
                    options={languagesShared.map((lang) => ({
                      value: lang,
                      label: languageSharedToHuman(lang),
                    }))}
                  />
                </div>
              ),
            },

            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.blue}
                  icon={<HeadsetIcon size={18} />}
                />
              ),
              text: t("settings_contact_support"),
              onClick: () => {
                platform.openInternalLink(links.supportChat);
              },
              isLinkColor: true,
            },

            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.turquoise}
                  icon={<ShieldIcon size={18} />}
                />
              ),
              text: t("privacy_policy"),
              onClick: () => {
                platform.openExternalLink(links.privacyPolicyPath);
              },
              isLinkColor: true,
            },
            {
              icon: (
                <FilledIcon
                  backgroundColor={theme.icons.sea}
                  icon={<MailIcon size={18} />}
                />
              ),
              text:
                platform instanceof BrowserPlatform ? (
                  <span>
                    <a
                      className={"reset-link text-link"}
                      href={`mailto:${links.supportEmail}`}
                    >
                      {links.supportEmail}
                    </a>
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      copyToClipboard(links.supportEmail);
                      notifySuccess(t("share_link_copied"));
                    }}
                  >
                    {links.supportEmail}
                  </span>
                ),
            },
          ]}
        />

        <HintTransparent>{t("settings_support_hint")}</HintTransparent>
      </div>

      {platform instanceof BrowserPlatform && (
        <div className="mt-1">
          <List
            items={[
              {
                icon: (
                  <FilledIcon
                    backgroundColor={theme.icons.sea}
                    icon={<LogOutIcon size={18} />}
                  />
                ),
                text: t("logout"),
                onClick: () => {
                  assert(platform instanceof BrowserPlatform);
                  platform.logout();
                },
              },

              userStore.canDeleteItsAccount
                ? {
                    icon: (
                      <FilledIcon
                        backgroundColor={theme.danger}
                        icon={<UserXIcon size={18} />}
                      />
                    ),
                    text: userSettingsStore.deleteAccountRequest.isLoading
                      ? t("ui_loading")
                      : "Delete account",
                    onClick: async () => {
                      const confirm = await showConfirm(
                        "Are you sure you want to delete your account?",
                      );
                      if (!confirm) {
                        return;
                      }

                      const result =
                        await userSettingsStore.deleteAccountRequest.execute();

                      if (result.status === "error") {
                        notifyError({
                          e: result.error,
                          info: "Failed to remove account",
                        });
                      } else {
                        window.location.reload();
                      }
                    },
                  }
                : null,
            ].filter(boolNarrow)}
          />
        </div>
      )}
    </Screen>
  );
}
