import { action, makeAutoObservable, when } from "mobx";
import { BooleanField, TextField } from "../lib/mobx-form/mobx-form.ts";
import { deckListStore } from "./deck-list-store.ts";
import { assert } from "../lib/typescript/assert.ts";
import { DateTime } from "luxon";
import { formatTime } from "../screens/user-settings/generate-time-range.tsx";
import { isFormTouched } from "../lib/mobx-form/form-has-error.ts";
import { userSettingsRequest } from "../api/api.ts";
import { screenStore } from "./screen-store.ts";

const DEFAULT_TIME = "12:00";

export class UserSettingsStore {
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

  get isSaveVisible() {
    return !!this.form && isFormTouched(this.form);
  }

  submit() {
    this.isSending = true;
    assert(this.form);

    const [hour, minute] = this.form.time.value.split(":");

    const body = {
      isRemindNotifyEnabled: this.form.isRemindNotifyEnabled.value,
      remindNotificationTime: DateTime.local()
        .set({
          hour: parseInt(hour),
          minute: parseInt(minute),
          second: 0,
        })
        .toUTC()
        .toString(),
    };

    userSettingsRequest(body)
      .then(() => {
        deckListStore.optimisticUpdateSettings({
          is_remind_enabled: body.isRemindNotifyEnabled,
          last_reminded_date: body.remindNotificationTime,
        });
        screenStore.go({ type: "main" });
      })
      .finally(
        action(() => {
          this.isSending = false;
        }),
      );
  }
}
