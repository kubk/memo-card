import { action, makeAutoObservable, when } from "mobx";
import { TextField } from "../../../lib/mobx-form/text-field.ts";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { DateTime } from "luxon";
import { formatTime } from "../generate-time-range.tsx";
import { isFormTouched } from "../../../lib/mobx-form/form-has-error.ts";
import { userSettingsRequest } from "../../../api/api.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { UserSettingsRequest } from "../../../../functions/user-settings.ts";
import { BooleanField } from "../../../lib/mobx-form/boolean-field.ts";

const DEFAULT_TIME = "12:00";

export class UserSettingsStore {
  form?: {
    isRemindNotifyEnabled: BooleanField;
    isSpeakingCardsEnabled: BooleanField;
    time: TextField<string>;
  };
  isSending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async load() {
    await when(() => !!deckListStore.myInfo);
    assert(deckListStore.myInfo);
    const userInfo = deckListStore.myInfo.user;
    const remindDate = userInfo.last_reminded_date
      ? DateTime.fromISO(userInfo.last_reminded_date)
      : null;

    this.form = {
      isRemindNotifyEnabled: new BooleanField(userInfo.is_remind_enabled),
      isSpeakingCardsEnabled: new BooleanField(
        !!userInfo.is_speaking_card_enabled,
      ),
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

    const body: UserSettingsRequest = {
      isRemindNotifyEnabled: this.form.isRemindNotifyEnabled.value,
      isSpeakingCardEnabled: this.form.isSpeakingCardsEnabled.value,
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
          is_speaking_card_enabled: body.isSpeakingCardEnabled,
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
