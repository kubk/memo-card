import { makeAutoObservable } from "mobx";
import { getBuyText } from "../translations.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";
import { platform } from "../../../lib/platform/platform.ts";
import { TextField } from "mobx-form-lite";
import {
  getPlanPrice,
  isPlanDurationAvailable,
  planDurations,
  type PlanDuration,
} from "api";
import { assert } from "api";
import { PaymentMethodType } from "api";
import { api, apiProxy } from "../../../api/trpc-api.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { makeMutation } from "../../../lib/mobx-query-lite/make-mutation.ts";

export class PlansScreenStore {
  plansQuery = makeQuery(apiProxy.plans.query);
  createOrderMutation = makeMutation(api.starsOrderPlan.mutate);
  createStripeOrderMutation = makeMutation(api.stripeOrderPlan.mutate);
  selectedPlanDuration = new TextField<PlanDuration | null>(null);
  method: PaymentMethodType | null = null;
  isPaymentOptionsOpen = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get plans() {
    return this.plansQuery.data?.plans ?? [];
  }

  get hasLoadedPlans() {
    return this.plansQuery.data !== undefined;
  }

  get selectedPlan() {
    return this.plans.find((plan) => plan.type === "pro") ?? null;
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
    const starsToUsdApprox = starsPrice / 50;
    const usdPrice = getPlanPrice(PaymentMethodType.Usd, selectedPlan, 1);

    const discount = (starsToUsdApprox - usdPrice) / starsToUsdApprox;

    return Math.max(0, +discount.toFixed(1));
  }

  get isCreatingOrder() {
    return (
      this.createOrderMutation.isPending ||
      this.createStripeOrderMutation.isPending
    );
  }

  get isMainButtonVisible() {
    if (!this.hasLoadedPlans || this.selectedPlan === null) {
      return false;
    }

    if (!this.isPaymentOptionsOpen) {
      return true;
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
        try {
          const result = await this.createOrderMutation.mutate({
            planType: selectedPlan.type,
            duration: this.selectedPlanDuration.value.toString(),
          });

          platform.openInvoiceLink(result.payLink);
        } catch (error) {
          const info = `Order creation failed. Plan: ${selectedPlan.type}`;
          notifyError({ info, e: error });
        }
        return;
      }
      case PaymentMethodType.Usd: {
        try {
          const result = await this.createStripeOrderMutation.mutate({
            planType: selectedPlan.type,
            duration: this.selectedPlanDuration.value.toString(),
          });

          platform.openExternalLink(result.checkoutUrl);
        } catch (error) {
          notifyError({
            info: `Stripe order creation failed. Plan: ${selectedPlan.type}`,
            e: error,
          });
        }
        return;
      }
      default:
        return this.method satisfies never;
    }
  }

  updateMethod(method: PaymentMethodType | null) {
    this.method = method;
  }

  openPaymentOptions() {
    const selectedPlan = this.selectedPlan;
    assert(selectedPlan);

    if (this.method === null) {
      this.method = selectedPlan.settings.paymentMethods.includes(
        PaymentMethodType.Usd,
      )
        ? PaymentMethodType.Usd
        : (selectedPlan.settings.paymentMethods[0] ?? null);
    }

    if (this.selectedPlanDuration.value === null) {
      const defaultDuration = this.availablePlanDurations.includes(1)
        ? 1
        : (this.availablePlanDurations[0] ?? null);
      this.selectedPlanDuration.onChange(defaultDuration);
    }

    this.isPaymentOptionsOpen = true;
  }

  closePaymentOptions() {
    this.isPaymentOptionsOpen = false;
  }

  handleMainButtonClick() {
    if (!this.isPaymentOptionsOpen) {
      this.openPaymentOptions();
      return;
    }

    return this.createOrder();
  }
}
