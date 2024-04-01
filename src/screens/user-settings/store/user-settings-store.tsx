import { action, makeAutoObservable, when } from "mobx";
import {
  BooleanField,
  formTouchAll,
  isFormValid,
  TextField,
} from "mobx-form-lite";
import { assert } from "../../../lib/typescript/assert.ts";
import { DateTime } from "luxon";
import { formatTime } from "../generate-time-range.tsx";
import { userSettingsRequest } from "../../../api/api.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { UserSettingsRequest } from "../../../../functions/user-settings.ts";
import { userStore } from "../../../store/user-store.ts";
import { hapticNotification } from "../../../lib/telegram/haptics.ts";

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

  submit() {
    assert(this.form);
    if (!isFormValid(this.form)) {
      formTouchAll(this.form);
      return;
    }

    this.isSending = true;

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
        hapticNotification("success");
        userStore.updateSettings({
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
