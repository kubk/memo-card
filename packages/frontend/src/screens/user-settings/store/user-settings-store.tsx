import { action, makeAutoObservable, when } from "mobx";
import {
  BooleanField,
  formTouchAll,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { DateTime } from "luxon";
import { formatTime } from "../generate-time-range.tsx";
import { deleteAccountRequest, userSettingsRequest } from "../../../api/api.ts";
import { UserSettingsRequest } from "api";
import { userStore } from "../../../store/user-store.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { t } from "../../../translations/t.ts";
import { assert } from "api";
import { getUserLanguage } from "api";
import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { LanguageShared } from "api";

const DEFAULT_TIME = "12:00";

export class UserSettingsStore {
  form?: {
    isRemindNotifyEnabled: BooleanField;
    isSpeakingCardsEnabled: BooleanField;
    time: TextField<string>;
    language: TextField<LanguageShared>;
  };
  isLangChanged = false;
  userSettingsRequest = new RequestStore(userSettingsRequest);
  deleteAccountRequest = new RequestStore(deleteAccountRequest);

  constructor() {
    makeAutoObservable(
      this,
      {
        isLangChanged: false,
      },
      { autoBind: true },
    );
  }

  load() {
    when(() => !!userStore.userInfo).then(
      action(() => {
        assert(userStore.userInfo);
        const userInfo = userStore.userInfo;
        const remindDate = userInfo.last_reminded_date
          ? DateTime.fromISO(userInfo.last_reminded_date)
          : null;

        this.form = {
          isRemindNotifyEnabled: new BooleanField(userInfo.is_remind_enabled),
          language: new TextField(getUserLanguage(userInfo), {
            afterChange: () => {
              this.isLangChanged = true;
            },
          }),
          isSpeakingCardsEnabled: new BooleanField(
            !!userInfo.is_speaking_card_enabled,
          ),
          time: new TextField(
            remindDate
              ? formatTime(remindDate.hour, remindDate.minute)
              : DEFAULT_TIME,
          ),
        };
      }),
    );
  }

  async submit() {
    assert(this.form);
    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return;
    }

    const [hour, minute] = this.form.time.value.split(":");

    const body: UserSettingsRequest = {
      isRemindNotifyEnabled: this.form.isRemindNotifyEnabled.value,
      isSpeakingCardEnabled: this.form.isSpeakingCardsEnabled.value,
      language: this.isLangChanged ? this.form.language.value : null,
      remindNotificationTime: DateTime.local()
        .set({
          hour: parseInt(hour),
          minute: parseInt(minute),
          second: 0,
        })
        .toUTC()
        .toString(),
    };

    const result = await this.userSettingsRequest.execute(body);

    if (result.status === "error") {
      notifyError({ e: result.error, info: "Error updating user settings" });
      return;
    }

    if (this.isLangChanged && platform instanceof BrowserPlatform) {
      platform.setLanguageCached(this.form.language.value);
    }

    userStore.updateSettings({
      is_remind_enabled: body.isRemindNotifyEnabled,
      last_reminded_date: body.remindNotificationTime,
      is_speaking_card_enabled: body.isSpeakingCardEnabled,
      force_language_code: this.isLangChanged
        ? this.form.language.value
        : undefined,
    });

    notifySuccess(t("user_settings_updated"));
  }
}
