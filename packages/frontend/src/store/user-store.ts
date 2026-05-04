import { autorun, makeAutoObservable } from "mobx";
import { type UserDbType } from "api";
import { type PlanForUser } from "api";
import { type PaidPlanType } from "api";
import { isPaidPlanType } from "api";
import { BooleanToggle } from "mobx-form-lite";
import { persistableField } from "../lib/mobx-form-lite-persistable/persistable-field.ts";
import { RequestStore } from "../lib/mobx-request/request-store.ts";
import { reportHandledError } from "../lib/rollbar/rollbar.tsx";
import { formatPaidUntil } from "../screens/pro/format-paid-until.tsx";
import { assert } from "api";
import { canDeleteItsAccount } from "api";
import { getUserLanguage } from "api";
import { LanguageShared } from "api";
import { platform } from "../lib/platform/platform.ts";
import { api } from "../api/trpc-api.ts";

type PaywallType =
  | "bulk_ai_cards"
  | "individual_ai_card"
  | "ai_speech"
  | "reverse_cards";

class UserStore {
  userInfo?: UserDbType;
  plan?: PlanForUser | null;
  isCardFormattingOn = persistableField(
    new BooleanToggle(false),
    "isCardFormattingOn",
  );
  isQuizzCardFormattingOn = persistableField(
    new BooleanToggle(false),
    "isQuizzCardFormattingOn",
  );
  isSkipReview = persistableField(new BooleanToggle(false), "isSkipReview");
  isSpeakingCardsMuted = new BooleanToggle(false);
  activePlanRequest = new RequestStore(api.activePlan.query);
  selectedPaywall: PaywallType | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    autorun(() => {
      if (this.isRtl) {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.removeAttribute("dir");
      }
    });
  }

  setUser(user: UserDbType, plan: PlanForUser | null) {
    this.userInfo = user;
    this.plan = plan;

    platform.setLanguageCached(getUserLanguage(user));
  }

  get language(): LanguageShared {
    if (!this.userInfo) {
      return platform.getLanguageCached();
    }

    return getUserLanguage(this.userInfo);
  }

  get isRtl() {
    return this.language === "ar" || this.language === "fa";
  }

  get isPaid() {
    return this.plan ? isPaidPlanType(this.plan.type) : false;
  }

  get isTeacherPaid() {
    return this.plan?.type === "teacher";
  }

  get user() {
    return this.userInfo ?? null;
  }

  get myId() {
    return this.user?.id;
  }

  get isAdmin() {
    return this.user?.isAdmin ?? false;
  }

  get isSpeakingCardsEnabled() {
    if (this.isSpeakingCardsMuted.value) {
      return false;
    }
    return this.user?.isSpeakingCardEnabled ?? false;
  }

  get paidUntil() {
    if (!this.plan) {
      return null;
    }
    return formatPaidUntil(this.plan.until_date || "") || undefined;
  }

  hasPaidPlan(planType: PaidPlanType) {
    if (!this.plan) {
      return false;
    }

    if (planType === "pro") {
      return isPaidPlanType(this.plan.type);
    }

    return this.plan.type === planType;
  }

  async fetchActivePlan() {
    const plan = await this.activePlanRequest.execute();
    if (plan.status === "success") {
      this.plan = plan.data.plan;
    } else {
      reportHandledError("Error fetching active plan", plan.error, {
        userId: this.myId,
      });
    }
  }

  updateSettings(body: Partial<UserDbType>) {
    assert(this.userInfo, "myInfo is not loaded in optimisticUpdateSettings");
    Object.assign(this.userInfo, body);
  }

  get canUpdateCatalogSettings() {
    return this.isAdmin;
  }

  get canDeleteItsAccount() {
    if (!this.user) {
      return false;
    }
    return canDeleteItsAccount(this.user);
  }

  executeViaPaywall(feature: PaywallType | null, cb: () => void) {
    if (this.isPaid) {
      cb();
    } else {
      this.selectedPaywall = feature;
    }
  }

  closePaywall() {
    this.selectedPaywall = null;
  }
}

export const userStore = new UserStore();
