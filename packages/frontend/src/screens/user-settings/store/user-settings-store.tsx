import { action, makeAutoObservable, when } from "mobx";
import {
  BooleanField,
  formUnTouchAll,
  formTouchAll,
  isFormDirty,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { DateTime } from "luxon";
import { formatTime } from "../generate-time-range.tsx";
import { RouterInput, stringToDate, UserDbType } from "api";
import { userStore } from "../../../store/user-store.ts";
import { makeMutation } from "../../../lib/mobx-query-lite/make-mutation.ts";
import { notifyError, notifySuccess } from "../../shared/snackbar/snackbar.tsx";
import { t } from "../../../translations/t.ts";
import { assert } from "api";
import { getUserLanguage } from "api";
import { platform } from "../../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { LanguageShared } from "api";
import { api } from "../../../api/trpc-api.ts";

const DEFAULT_TIME = "12:00";

export class UserSettingsStore {
  form?: {
    isRemindNotifyEnabled: BooleanField;
    isSpeakingCardsEnabled: BooleanField;
    time: TextField<string>;
    language: TextField<LanguageShared>;
  };
  userSettingsMutation = makeMutation(api.userSettings.mutate);
  deleteAccountMutation = makeMutation(api.me.deleteAccount.mutate);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isDirty() {
    return this.form ? isFormDirty(this.form) : false;
  }

  load() {
    when(() => !!userStore.userInfo).then(
      action(() => {
        assert(userStore.userInfo);
        const userInfo = userStore.userInfo;
        const remindDate = userInfo.lastRemindedDate
          ? stringToDate(userInfo.lastRemindedDate)
          : null;

        this.form = {
          isRemindNotifyEnabled: new BooleanField(userInfo.isRemindEnabled),
          language: new TextField(getUserLanguage(userInfo)),
          isSpeakingCardsEnabled: new BooleanField(
            !!userInfo.isSpeakingCardEnabled,
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

    const body: RouterInput["userSettings"] = {
      isRemindNotifyEnabled: this.form.isRemindNotifyEnabled.value,
      isSpeakingCardEnabled: this.form.isSpeakingCardsEnabled.value,
      language: this.form.language.isDirty ? this.form.language.value : null,
      remindNotificationTime: DateTime.local()
        .set({
          hour: parseInt(hour),
          minute: parseInt(minute),
          second: 0,
        })
        .toUTC()
        .toString(),
    };

    const result = await this.userSettingsMutation.mutateResult(body);

    if (!result.ok) {
      notifyError({ e: result.error, info: "Error updating user settings" });
      return;
    }

    if (body.language !== null && platform instanceof BrowserPlatform) {
      platform.setLanguageCached(this.form.language.value);
    }

    const settings: Partial<UserDbType> = {
      isRemindEnabled: body.isRemindNotifyEnabled,
      lastRemindedDate: body.remindNotificationTime,
      isSpeakingCardEnabled: body.isSpeakingCardEnabled,
    };

    if (body.language !== null) {
      settings.forceLanguageCode = body.language;
    }

    userStore.updateSettings(settings);
    formUnTouchAll(this.form);

    notifySuccess(t("user_settings_updated"));
  }
}
