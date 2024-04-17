import { makeAutoObservable } from "mobx";
import { allPlansRequest, createOrderRequest } from "../../../api/api.ts";
import { getBuyText } from "../translations.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import WebApp from "@twa-dev/sdk";
import { RequestStore } from "../../../lib/mobx-request/request-store.ts";
import { notifyError } from "../../shared/snackbar/snackbar.tsx";

export class PlansScreenStore {
  plansRequest = new RequestStore(allPlansRequest);
  createOrderRequest = new RequestStore(createOrderRequest);
  selectedPlanId: number | null = null;

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

  get selectedPlan() {
    return this.plans.find((plan) => plan.id === this.selectedPlanId);
  }

  get isBuyButtonVisible() {
    return this.selectedPlanId !== null;
  }

  selectPlan(planId: number) {
    this.selectedPlanId = planId;
  }

  get buyText() {
    const selectedPlan = this.selectedPlan;
    if (!selectedPlan) {
      return "";
    }

    return getBuyText(selectedPlan);
  }

  async createOrder() {
    assert(this.selectedPlanId !== null);

    const result = await this.createOrderRequest.execute(this.selectedPlanId);
    if (result.status === "error") {
      const info = `Order creation failed. Plan: ${this.selectedPlanId}`;
      notifyError({ info: info, e: result.error });
      return;
    }

    WebApp.openTelegramLink(result.data.payLink);
  }
}
