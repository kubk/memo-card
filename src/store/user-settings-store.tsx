import { action, makeAutoObservable, when } from "mobx";
import { BooleanField, TextField } from "../lib/mobx-form/mobx-form.ts";
import { deckListStore } from "./deck-list-store.ts";
import { assert } from "../lib/typescript/assert.ts";
import { DateTime } from "luxon";
import { formatTime } from "../screens/user-settings/generate-time-range.tsx";
import { isFormTouched } from "../lib/mobx-form/form-has-error.ts";
import { userSettingsRequest } from "../api/api.ts";

export enum UserSettingsScreen {
  UserReviewSettings = "userReviewSettings",
}

const DEFAULT_TIME = "12:00";

export class UserSettingsStore {
  screen?: UserSettingsScreen;
  form?: {
    isRemindNotifyEnabled: BooleanField;
    time: TextField<string>;
  };
  isSending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async load() {
    await when(() => deckListStore.myInfo?.state === "fulfilled");
    assert(deckListStore.myInfo?.state === "fulfilled");
    const userInfo = deckListStore.myInfo.value.user;
    const remindDate = userInfo.last_reminded_date
      ? DateTime.fromISO(userInfo.last_reminded_date)
      : null;

    this.form = {
      isRemindNotifyEnabled: new BooleanField(userInfo.is_remind_enabled),
      time: new TextField(
        remindDate
          ? formatTime(remindDate.hour, remindDate.minute)
          : DEFAULT_TIME,
      ),
    };
  }

  goToUserReviewSettings() {
    this.screen = UserSettingsScreen.UserReviewSettings;
  }

  goToMain() {
    this.screen = undefined;
  }

  get isSaveVisible() {
    return !!this.form && isFormTouched(this.form);
  }

  get notifyTimePreview() {
    if (!this.form) {
      return null;
    }

    if (!this.form.isRemindNotifyEnabled.value) {
      return "Off";
    }

    return this.form?.time?.value || "Not set";
  }

  submit() {
    this.isSending = true;
    assert(this.form);

    const [hour, minute] = this.form.time.value.split(":");

    userSettingsRequest({
      isRemindNotifyEnabled: this.form.isRemindNotifyEnabled.value,
      remindNotificationTime: DateTime.local()
        .set({
          hour: parseInt(hour),
          minute: parseInt(minute),
          second: 0,
        })
        .toUTC()
        .toString(),
    })
      .then(() => {
        this.goToMain();
      })
      .finally(
        action(() => {
          this.isSending = false;
        }),
      );
  }
}
