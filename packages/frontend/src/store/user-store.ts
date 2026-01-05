import { autorun, makeAutoObservable } from "mobx";
import { type UserDbType } from "api";
import { type PlansForUser } from "api";
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

type PaywallType = "bulk_ai_cards" | "individual_ai_card" | "ai_speech";

class UserStore {
  userInfo?: UserDbType;
  plans?: PlansForUser;
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
  activePlansRequest = new RequestStore(api.activePlans.query);
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

  setUser(user: UserDbType, plans: PlansForUser) {
    this.userInfo = user;
    this.plans = plans;

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
    return this.plans?.some((plan) => plan.plan_id) ?? false;
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
    const plan = this.plans ? this.plans[0] : undefined;
    if (!plan) {
      return null;
    }
    return formatPaidUntil(plan.until_date || "") || undefined;
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
