import { makeAutoObservable } from "mobx";
import { type UserDbType } from "../../functions/db/user/upsert-user-db.ts";
import { assert } from "../lib/typescript/assert.ts";
import { type PlansForUser } from "../../functions/db/plan/get-active-plans-for-user.ts";
import { BooleanToggle } from "mobx-form-lite";
import { persistableField } from "../lib/mobx-form-lite-persistable/persistable-field.ts";
import { canAdvancedShare } from "../../shared/access/can-advanced-share.ts";
import { canUseAiMassGenerate } from "../../shared/access/can-use-ai-mass-generate.ts";
import { RequestStore } from "../lib/mobx-request/request-store.ts";
import { activePlanesRequest } from "../api/api.ts";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";

export class UserStore {
  userInfo?: UserDbType;
  plans?: PlansForUser;
  isCardFormattingOn = persistableField(
    new BooleanToggle(false),
    "isCardFormattingOn",
  );
  isSpeakingCardsMuted = new BooleanToggle(false);
  activePlansRequest = new RequestStore(activePlanesRequest);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
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

  get isPaid() {
    return this.plans?.some((plan) => plan.plan_id) ?? false;
  }

  async fetchActivePlans() {
    const plans = await this.activePlansRequest.execute();
    if (plans.status === "success") {
      this.plans = plans.data.plans;
    } else {
      reportHandledError("Error fetching active plans", plans.error, {
        userId: this.myId,
      });
    }
  }

  updateSettings(body: Partial<UserDbType>) {
    assert(this.userInfo, "myInfo is not loaded in optimisticUpdateSettings");
    Object.assign(this.userInfo, body);
  }

  get canUseAiMassGenerate() {
    const user = this.user;
    if (!user) {
      return false;
    }
    return canUseAiMassGenerate(user, userStore.plans);
  }
}

export const userStore = new UserStore();
