import { makeAutoObservable } from "mobx";
import { allPlansRequest, starsOrderPlanRequest } from "../../../api/api.ts";
import { getBuyText } from "../translations.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";
import { platform } from "../../../lib/platform/platform.ts";
import { TextField } from "mobx-form-lite";
import { type PlanDuration } from "../../../../shared/pro/calc-plan-price-for-duration.ts";
import { TelegramPlatform } from "../../../lib/platform/telegram/telegram-platform.ts";

export class PlansScreenStore {
  plansRequest = new RequestStore(allPlansRequest);
  createOrderRequest = new RequestStore(starsOrderPlanRequest);
  selectedPlanDuration = new TextField<PlanDuration | null>(null);

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
    return getBuyText(selectedPlan, this.selectedPlanDuration.value);
  }

  async createOrder() {
    assert(this.proPlan);
    assert(this.selectedPlanDuration.value);
    const result = await this.createOrderRequest.execute(
      this.proPlan.id,
      this.selectedPlanDuration.value,
    );
    if (result.status === "error") {
      const info = `Order creation failed. Plan: ${this.proPlan.id}`;
      notifyError({ info: info, e: result.error });
      return;
    }

    if (!(platform instanceof TelegramPlatform)) {
      return;
    }
    platform.openInvoiceLink(result.data.payLink);
  }
}
