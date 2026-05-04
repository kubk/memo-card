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
import { TelegramPlatform } from "../../../lib/platform/telegram/telegram-platform.ts";
import { links } from "api";
import { api } from "../../../api/trpc-api.ts";

export type PreviewItem =
  | "individual_ai_card"
  | "bulk_ai_cards"
  | "ai_speech"
  | "reverse_cards";

export class PlansScreenStore {
  plansRequest = new RequestStore(api.plans.query);
  createOrderRequest = new RequestStore(api.starsOrderPlan.mutate);
  selectedPlanDuration = new TextField<PlanDuration | null>(null);
  selectedPlanType: TextField<PaidPlanType>;
  selectedPreviewPlanFeature?: PreviewItem;

  method =
    platform instanceof TelegramPlatform
      ? PaymentMethodType.Stars
      : PaymentMethodType.Usd;

  constructor(initialPlanType: PaidPlanType = "pro") {
    this.selectedPlanType = new TextField(initialPlanType);
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
    return this.selectedPlanDuration.value !== null;
  }

  get buyText() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan || !this.selectedPlanDuration.value) {
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

    switch (selectedPlan.type) {
      case "pro":
        return this.selectedPlanDuration.value === 12
          ? links.stripeProYearlySubscription
          : links.stripeProMonthlySubscription;
      case "teacher":
        return this.selectedPlanDuration.value === 12
          ? links.stripeTeacherYearlySubscription
          : links.stripeTeacherMonthlySubscription;
      default:
        return selectedPlan.type satisfies never;
    }
  }

  get availablePlanDurations() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan) {
      return [];
    }

    return planDurations.filter((duration) =>
      isPlanDurationAvailable(this.method, selectedPlan, duration),
    );
  }

  async createOrder() {
    const selectedPlan = this.selectedPlan;
    assert(selectedPlan);
    assert(this.selectedPlanDuration.value);

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
            info: `Bank card payment is not configured for plan: ${selectedPlan.type}`,
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

  updateMethod(method: PaymentMethodType) {
    this.method = method;
    this.ensureAvailablePaymentMethod();
    this.ensureAvailableDuration();
  }

  updateSelectedPlanType(planType: PaidPlanType) {
    this.selectedPlanType.onChange(planType);
    this.ensureAvailablePaymentMethod();
    this.ensureAvailableDuration();
  }

  ensureAvailablePaymentMethod() {
    if (this.method === PaymentMethodType.Usd && !this.isUsdPaymentAvailable) {
      this.method = PaymentMethodType.Stars;
    }
  }

  ensureAvailableDuration() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan || this.selectedPlanDuration.value === null) {
      return;
    }

    if (
      !isPlanDurationAvailable(
        this.method,
        selectedPlan,
        this.selectedPlanDuration.value,
      )
    ) {
      this.selectedPlanDuration.onChange(
        this.availablePlanDurations[0] ?? null,
      );
    }
  }

  getDiscountForDuration(plan: PaymentPlan, duration: PlanDuration) {
    return getPlanDiscountForDuration(this.method, plan, duration);
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
