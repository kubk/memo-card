import { makeAutoObservable } from "mobx";
import { type UserDbType } from "../../functions/db/user/upsert-user-db.ts";
import { assert } from "../lib/typescript/assert.ts";
import { type PlansForUser } from "../../functions/db/plan/get-active-plans-for-user.ts";
import { makePersistable } from "mobx-persist-store";
import { storageAdapter } from "../lib/telegram/storage-adapter.ts";
import { BooleanToggle } from "mobx-form-lite";
import { CardAnswerType } from "../../functions/db/custom-types.ts";
import { persistableField } from "../lib/mobx-form-lite-persistable/persistable-field.ts";
import { canAdvancedShare } from "../../shared/access/can-advanced-share.ts";

export class UserStore {
  userInfo?: UserDbType;
  plans?: PlansForUser;
  isCardFormattingOn = persistableField(
    new BooleanToggle(false),
    "isCardFormattingOn",
  );
  defaultCardType: CardAnswerType = "remember";
  isSpeakingCardsMuted = new BooleanToggle(false);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "defaultCardType",
      properties: ["defaultCardType"],
      storage: storageAdapter,
    });
  }

  updateDefaultCardType(type: CardAnswerType) {
    this.defaultCardType = type;
  }

  setUser(user: UserDbType, plans: PlansForUser) {
    this.userInfo = user;
    this.plans = plans;
  }

  get user() {
    return this.userInfo ?? null;
  }

  get myId() {
    return this.user?.id;
  }

  get isAdmin() {
    return this.user?.is_admin ?? false;
  }

  get isSpeakingCardsEnabled() {
    if (this.isSpeakingCardsMuted.value) {
      return false;
    }
    return this.user?.is_speaking_card_enabled ?? false;
  }

  get canAdvancedShare() {
    if (!this.user || !this.plans) {
      return false;
    }
    return canAdvancedShare(this.user, this.plans);
  }

  updateSettings(body: Partial<UserDbType>) {
    assert(this.userInfo, "myInfo is not loaded in optimisticUpdateSettings");
    Object.assign(this.userInfo, body);
  }
}

export const userStore = new UserStore();
