import { autorun, makeAutoObservable } from "mobx";
import { type RouterOutput } from "api";
import { type UserDbType } from "api";

type MyInfoResponse = RouterOutput["me"]["info"];
import { isPaidPlanType } from "api";
import { BooleanToggle } from "mobx-form-lite";
import { persistableField } from "../lib/mobx-form-lite-persistable/persistable-field.ts";
import { formatPaidUntil } from "../screens/pro/format-paid-until.tsx";
import { assert } from "api";
import { getUserLanguage } from "api";
import { isRtlLanguage, LanguageShared } from "api";
import { platform } from "../lib/platform/platform.ts";
import { apiProxy } from "../api/trpc-api.ts";
import { makeQuery } from "../lib/mobx-query-lite/make-query.ts";

class UserStore {
  userInfo?: UserDbType;
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
  activePlanQuery = makeQuery(apiProxy.activePlan.query);

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

  setUser(user: UserDbType, plan: MyInfoResponse["plan"]) {
    this.userInfo = user;
    this.setActivePlan(plan);

    platform.setLanguageCached(getUserLanguage(user));
  }

  setActivePlan(plan: MyInfoResponse["plan"]) {
    this.activePlanQuery.setData({ plan });
  }

  get language(): LanguageShared {
    if (!this.userInfo) {
      return platform.getLanguageCached();
    }

    return getUserLanguage(this.userInfo);
  }

  get isRtl() {
    return isRtlLanguage(this.language);
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

  get plan(): MyInfoResponse["plan"] {
    if (!this.userInfo) {
      return null;
    }

    return this.activePlanQuery.data?.plan ?? null;
  }

  get myId() {
    return this.user?.id;
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

  updateSettings(body: Partial<UserDbType>) {
    assert(this.userInfo);
    Object.assign(this.userInfo, body);
  }
}

export const userStore = new UserStore();
