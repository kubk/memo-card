import { makeAutoObservable } from "mobx";
import { getBuyText } from "../translations.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";
import { platform } from "../../../lib/platform/platform.ts";
import { TextField } from "mobx-form-lite";
import {
  getPlanDiscountForDuration,
  getPlanPrice,
  calcUsdFromStars,
  isPlanDurationAvailable,
  planDurations,
  type PaidPlanType,
  type PaymentPlan,
  type PlanDuration,
} from "api";
import { assert } from "api";
import { PaymentMethodType } from "api";
import { links } from "api";
import { api } from "../../../api/trpc-api.ts";

export type PreviewItem =
  | "individual_ai_card"
  | "bulk_ai_cards"
  | "ai_speech"
  | "reverse_cards";

const stripeSubscriptionLinks = {
  pro: {
    1: links.stripeProMonthlySubscription,
    6: null,
    12: links.stripeProYearlySubscription,
  },
  teacher: {
    1: links.stripeTeacherMonthlySubscription,
    6: null,
    12: links.stripeTeacherYearlySubscription,
  },
} satisfies Record<PaidPlanType, Record<PlanDuration, string | null>>;

export class PlansScreenStore {
  plansRequest = new RequestStore(api.plans.query);
  createOrderRequest = new RequestStore(api.starsOrderPlan.mutate);
  selectedPlanDuration = new TextField<PlanDuration | null>(null);
  selectedPlanType: TextField<PaidPlanType>;
  selectedPreviewPlanFeature?: PreviewItem;
  method: PaymentMethodType | null = null;

  constructor(planType: PaidPlanType) {
    this.selectedPlanType = new TextField(planType);
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async load() {
    const result = await this.plansRequest.execute();
    if (result.status !== "success") {
      return;
    }

    if (
      !this.paymentPlans.some(
        (plan) => plan.type === this.selectedPlanType.value,
      ) &&
      this.paymentPlans[0]
    ) {
      this.selectedPlanType.onChange(this.paymentPlans[0].type);
    }

    this.ensureAvailablePaymentMethod();
    this.ensureAvailableDuration();
  }

  get plans() {
    return this.plansRequest.result.status === "success"
      ? this.plansRequest.result.data.plans
      : [];
  }

  get paymentPlans() {
    return this.plans;
  }

  get selectedPlan() {
    return (
      this.paymentPlans.find(
        (plan) => plan.type === this.selectedPlanType.value,
      ) ??
      this.paymentPlans[0] ??
      null
    );
  }

  get isTeacherPlanSelected() {
    return this.selectedPlan?.type === "teacher";
  }

  get isUsdPaymentAvailable() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan) {
      return false;
    }

    return selectedPlan.settings.paymentMethods.includes(PaymentMethodType.Usd);
  }

  get durationDisplayMethod() {
    if (this.method) {
      return this.method;
    }

    const selectedPlan = this.selectedPlan;
    if (selectedPlan?.settings.paymentMethods.includes(PaymentMethodType.Usd)) {
      return PaymentMethodType.Usd;
    }

    return selectedPlan?.settings.paymentMethods[0] ?? PaymentMethodType.Stars;
  }

  get bankCardDiscount() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan) return 0.2;
    const starsPrice = getPlanPrice(PaymentMethodType.Stars, selectedPlan, 1);
    const starsToUsdApprox =
      selectedPlan.type === "teacher"
        ? calcUsdFromStars(starsPrice)
        : starsPrice / 50;
    const usdPrice = getPlanPrice(PaymentMethodType.Usd, selectedPlan, 1);

    const discount = (starsToUsdApprox - usdPrice) / starsToUsdApprox;

    return Math.max(0, +discount.toFixed(1));
  }

  get aiCardsLeft() {
    return this.plansRequest.result.status === "success"
      ? this.plansRequest.result.data.aiCardsLeft
      : 0;
  }

  get isBuyButtonVisible() {
    if (this.selectedPreviewPlanFeature) {
      return false;
    }
    return this.method !== null && this.selectedPlanDuration.value !== null;
  }

  get buyText() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan || !this.selectedPlanDuration.value || !this.method) {
      return "";
    }
    return getBuyText(
      selectedPlan,
      this.selectedPlanDuration.value,
      this.method,
    );
  }

  get usdPaymentLink() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan || !this.selectedPlanDuration.value) {
      return null;
    }

    return (
      stripeSubscriptionLinks[selectedPlan.type][
        this.selectedPlanDuration.value
      ] ?? null
    );
  }

  get availablePlanDurations() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan) {
      return [];
    }

    return planDurations.filter((duration) =>
      isPlanDurationAvailable(
        this.durationDisplayMethod,
        selectedPlan,
        duration,
      ),
    );
  }

  async createOrder() {
    const selectedPlan = this.selectedPlan;
    assert(selectedPlan);
    assert(this.selectedPlanDuration.value);
    assert(this.method);

    switch (this.method) {
      case PaymentMethodType.Stars: {
        const result = await this.createOrderRequest.execute({
          planType: selectedPlan.type,
          duration: this.selectedPlanDuration.value.toString(),
        });
        if (result.status === "error") {
          const info = `Order creation failed. Plan: ${selectedPlan.type}`;
          notifyError({ info: info, e: result.error });
          return;
        }

        platform.openInvoiceLink(result.data.payLink);
        return;
      }
      case PaymentMethodType.Usd: {
        const link = this.usdPaymentLink;
        if (!link) {
          notifyError({
            info: `Bank card payment is not configured for plan: ${selectedPlan.type}, duration: ${this.selectedPlanDuration.value}`,
          });
          return;
        }

        platform.openExternalLink(link);
        return;
      }
      default:
        return this.method satisfies never;
    }
  }

  updateMethod(method: PaymentMethodType | null) {
    this.method = method;
    this.ensureAvailablePaymentMethod();
    this.ensureAvailableDuration();
  }

  ensureAvailablePaymentMethod() {
    if (this.method === null) {
      return;
    }

    if (this.method === PaymentMethodType.Usd && !this.isUsdPaymentAvailable) {
      this.method = PaymentMethodType.Stars;
    }
  }

  ensureAvailableDuration() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan || this.selectedPlanDuration.value === null) {
      return;
    }

    const method = this.method ?? this.durationDisplayMethod;

    if (
      !isPlanDurationAvailable(
        method,
        selectedPlan,
        this.selectedPlanDuration.value,
      )
    ) {
      this.selectedPlanDuration.onChange(
        this.availablePlanDurations[0] ?? null,
      );
    }
  }

  getDiscountForDuration(
    method: PaymentMethodType,
    plan: PaymentPlan,
    duration: PlanDuration,
  ) {
    return getPlanDiscountForDuration(method, plan, duration);
  }

  previewPlanFeature(previewItem: PreviewItem | undefined) {
    if (previewItem === undefined) {
      return;
    }
    this.selectedPreviewPlanFeature = previewItem;
  }

  quitPreviewPlanFeature() {
    this.selectedPreviewPlanFeature = undefined;
  }
}
