import { useUserSettingsStore } from "./store/user-settings-store-context.tsx";
import { deckListStore } from "../../store/deck-list-store.ts";
import { useEffect } from "preact/compat";
import { generateTimeRange } from "./generate-time-range.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { RadioSwitcher } from "../../ui/radio-switcher.tsx";
import { DropdownOrVault } from "../../ui/dropdown-or-vault.tsx";
import { RadioBoxEmpty } from "../../ui/radio-list/radio-box-empty.tsx";
import { RadioBoxFilled } from "../../ui/radio-list/radio-box-filled.tsx";
import { Select } from "../../ui/select.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { LabelGroup } from "../../ui/label-group.tsx";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import { links, sharedProTitle } from "api";
import { List } from "../../ui/list.tsx";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { boolNarrow } from "../../lib/typescript/bool-narrow.ts";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { userStore } from "../../store/user-store.ts";
import { ProIcon } from "../../ui/pro-icon.tsx";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { assert } from "api";
import { notifySuccess } from "../shared/snackbar/snackbar.tsx";
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
  LanguagesIcon,
  InfoIcon,
  TypeIcon,
} from "lucide-react";
import {
  type FontSize,
  fontSizes,
  fontSizeStore,
} from "../../lib/font-size/font-size-store.ts";

const timeRanges = generateTimeRange();

function getFontSizeLabel(fontSize: FontSize) {
  switch (fontSize) {
    case "normal":
      return t("font_size_normal");
    case "medium":
      return t("font_size_medium");
    case "large":
      return t("font_size_large");
  }
}

export function UserSettingsScreen() {
  const userSettingsStore = useUserSettingsStore();
  const screen = screenStore.screen;
  assert(screen.type === "userSettings");

  useEffect(() => {
    userSettingsStore.load();
  }, [userSettingsStore, screen.index]);

  useMainButton(
    t("save"),
    () => userSettingsStore.submit(),
    () => userSettingsStore.isDirty,
  );

  useBackButton(() => {
    screenStore.back();
  });
  useProgress(() => userSettingsStore.userSettingsMutation.isPending);

  if (!deckListStore.myInfo || !userSettingsStore.form) {
    return null;
  }

  const { isRemindNotifyEnabled, isSpeakingCardsEnabled, time, language } =
    userSettingsStore.form;

  return (
    <Screen title={t("settings")}>
      <LabelGroup
        description={
          userStore.paidUntil ? (
            <span>
              {t("payment_paid_until")}: {userStore.paidUntil}
            </span>
          ) : (
            t("payment_description")
          )
        }
      >
        <List
          items={[
            {
              icon: <ProIcon />,
              text: sharedProTitle,
              right: <ChevronIcon direction="right" className="text-hint" />,
              onClick: () => {
                screenStore.push({ type: "plans", planType: "pro" });
              },
            },
          ]}
        />
      </LabelGroup>

      <div className="mt-3">
        <LabelGroup description={t("freeze_hint")}>
          <List
            items={[
              {
                icon: (
                  <FilledIcon
                    className="bg-tile-turquoise"
                    icon={<SnowflakeIcon className="size-4.5" />}
                  />
                ),
                text: t("freeze_title"),
                onClick: () => {
                  screenStore.push({ type: "freezeCards" });
                },
              },
            ]}
          />
        </LabelGroup>
      </div>

      <div className="mt-3">
        <LabelGroup description={t("settings_review_notifications_hint")}>
          <List
            items={[
              {
                icon: (
                  <FilledIcon
                    className="bg-tile-sea"
                    icon={<BellIcon className="size-4.5" />}
                  />
                ),
                right: (
                  <span className="relative top-0.75">
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
                        className="bg-orange"
                        icon={<ClockIcon className="size-4.5" />}
                      />
                    ),
                    text: t("settings_time"),
                    right: (
                      <div className="text-link">
                        <Select
                          value={time.value.toString()}
                          onChange={(value) => time.onChange(value)}
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
        </LabelGroup>
      </div>

      <div className="mt-3">
        <LabelGroup description={t("card_speak_description")}>
          <List
            animateTap={false}
            items={[
              {
                icon: (
                  <FilledIcon
                    className="bg-tile-pink"
                    icon={<MicIcon className="size-4.5" />}
                  />
                ),
                right: (
                  <span className="relative top-0.75">
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
        </LabelGroup>
      </div>

      <div className="mt-3">
        <LabelGroup description={t("settings_support_hint")}>
          <List
            items={[
              {
                icon: (
                  <FilledIcon
                    className="bg-tile-violet"
                    icon={<LanguagesIcon className="size-4.5" />}
                  />
                ),
                text: t("settings_lang"),
                right: (
                  <div className="text-link">
                    <DropdownOrVault
                      trigger={
                        <span>{languageSharedToHuman(language.value)}</span>
                      }
                      triggerClassName="text-left text-base text-link"
                      options={languagesShared.map((lang) => ({
                        icon:
                          language.value === lang ? (
                            <RadioBoxFilled />
                          ) : (
                            <RadioBoxEmpty />
                          ),
                        text: languageSharedToHuman(lang),
                        onClick: () => language.onChange(lang),
                      }))}
                    />
                  </div>
                ),
              },

              {
                icon: (
                  <FilledIcon
                    className="bg-tile-coral"
                    icon={<TypeIcon className="size-4.5" />}
                  />
                ),
                text: t("font_size"),
                right: (
                  <div className="text-link">
                    <DropdownOrVault
                      trigger={
                        <span>{getFontSizeLabel(fontSizeStore.fontSize)}</span>
                      }
                      triggerClassName="text-left text-base text-link"
                      options={fontSizes.map((fontSize) => ({
                        icon:
                          fontSizeStore.fontSize === fontSize ? (
                            <RadioBoxFilled />
                          ) : (
                            <RadioBoxEmpty />
                          ),
                        text: getFontSizeLabel(fontSize),
                        onClick: () => fontSizeStore.setFontSize(fontSize),
                      }))}
                    />
                  </div>
                ),
              },

              {
                icon: (
                  <FilledIcon
                    className="bg-tile-blue"
                    icon={<HeadsetIcon className="size-4.5" />}
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
                    className="bg-tile-turquoise"
                    icon={<ShieldIcon className="size-4.5" />}
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
                    className="bg-tile-sea"
                    icon={<MailIcon className="size-4.5" />}
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
              {
                icon: (
                  <FilledIcon
                    className="bg-orange"
                    icon={<InfoIcon className="size-4.5" />}
                  />
                ),
                text: t("about_title"),
                onClick: () => {
                  screenStore.push({ type: "about" });
                },
                isLinkColor: true,
              },
            ]}
          />
        </LabelGroup>
      </div>

      {platform instanceof BrowserPlatform && (
        <div className="mt-3">
          <List
            items={[
              {
                icon: (
                  <FilledIcon
                    className="bg-tile-sea"
                    icon={<LogOutIcon className="size-4.5" />}
                  />
                ),
                text: t("logout"),
                onClick: () => {
                  assert(platform instanceof BrowserPlatform);
                  platform.logout();
                },
              },
            ]}
          />
        </div>
      )}
    </Screen>
  );
}
