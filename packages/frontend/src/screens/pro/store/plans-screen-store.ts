import { makeAutoObservable } from "mobx";
import { starsOrderPlanRequest } from "../../../api/api.ts";
import { getBuyText } from "../translations.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";
import { platform } from "../../../lib/platform/platform.ts";
import { TextField } from "mobx-form-lite";
import { durationsWithDiscount, type PlanDuration } from "api";
import { assert } from "api";
import { PaymentMethodType } from "api";
import { BrowserPlatform } from "../../../lib/platform/browser/browser-platform.ts";
import { TelegramPlatform } from "../../../lib/platform/telegram/telegram-platform.ts";
import { links } from "api";
import { api } from "../../../api/trpc-api.ts";

export type PreviewItem = "individual_ai_card" | "bulk_ai_cards" | "ai_speech";

export class PlansScreenStore {
  plansRequest = new RequestStore(api["plans"].query);
  createOrderRequest = new RequestStore(starsOrderPlanRequest);
  selectedPlanDuration = new TextField<PlanDuration | null>(null);
  selectedPreviewPlanFeature?: PreviewItem;

  method =
    platform instanceof TelegramPlatform
      ? PaymentMethodType.Stars
      : PaymentMethodType.Usd;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.plansRequest.execute();
  }

  get plans() {
    return this.plansRequest.result.status === "success"
      ? this.plansRequest.result.data.plans
      : [];
  }

  get proPlan() {
    return this.plansRequest.result.status === "success"
      ? this.plansRequest.result.data.plans[0]
      : null;
  }

  get bankCardDiscount() {
    const proPlan = this.proPlan;
    if (!proPlan) return 0.2;
    const starsToUsdApprox = proPlan.priceStars / 50;

    return +((starsToUsdApprox - proPlan.price) / starsToUsdApprox).toFixed(1);
  }

  get aiCardsLeft() {
    return this.plansRequest.result.status === "success"
      ? this.plansRequest.result.data.aiCardsLeft
      : 0;
  }

  get isBuyButtonVisible() {
    return this.selectedPlanDuration.value !== null;
  }

  get buyText() {
    const selectedPlan = this.proPlan;
    if (!selectedPlan || !this.selectedPlanDuration.value) {
      return "";
    }
    return getBuyText(
      selectedPlan,
      this.selectedPlanDuration.value,
      this.method,
      this.totalDiscount,
    );
  }

  private get totalDiscount() {
    const duration = this.selectedPlanDuration.value;
    if (!duration) return 0;
    const methodDiscount =
      this.method === PaymentMethodType.Usd ? this.bankCardDiscount : 0;

    const durationWithDiscount = durationsWithDiscount.find(
      (item) => item.duration === duration,
    );
    if (!durationWithDiscount) return methodDiscount;

    const durationDiscount =
      this.method === PaymentMethodType.Usd
        ? durationWithDiscount.discount
        : durationWithDiscount.discountStars;

    return durationDiscount + methodDiscount;
  }

  async createOrder() {
    assert(this.proPlan);
    assert(this.selectedPlanDuration.value);

    if (this.method === PaymentMethodType.Stars) {
      const result = await this.createOrderRequest.execute(
        this.proPlan.id,
        this.selectedPlanDuration.value,
      );
      if (result.status === "error") {
        const info = `Order creation failed. Plan: ${this.proPlan.id}`;
        notifyError({ info: info, e: result.error });
        return;
      }

      platform.openInvoiceLink(result.data.payLink);
    } else if (this.method === PaymentMethodType.Usd) {
      assert(platform instanceof BrowserPlatform);

      const link =
        this.selectedPlanDuration.value === 12
          ? links.lsqYearlySubscription
          : links.lsqMonthlySubscription;

      platform.openExternalLink(link);
    }
  }

  updateMethod(method: PaymentMethodType) {
    assert(platform instanceof BrowserPlatform);
    this.method = method;

    // LemonSqueezy doesn't support 6 months plans
    if (
      this.method === PaymentMethodType.Usd &&
      this.selectedPlanDuration.value === 6
    ) {
      this.selectedPlanDuration.onChange(12);
    }
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
