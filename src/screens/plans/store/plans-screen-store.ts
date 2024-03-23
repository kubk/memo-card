import { action, makeAutoObservable } from "mobx";
import { AllPlansResponse } from "../../../../functions/plans.ts";
import {
  fromPromise,
  IPromiseBasedObservable,
} from "../../../lib/mobx-from-promise/from-promise.ts";
import { allPlansRequest, createOrderRequest } from "../../../api/api.ts";
import { getBuyText } from "../translations.ts";
import { assert } from "../../../lib/typescript/assert.ts";
import WebApp from "@twa-dev/sdk";

export class PlansScreenStore {
  plansRequest?: IPromiseBasedObservable<AllPlansResponse>;
  isCreatingOrder = false;
  selectedPlanId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  load() {
    this.plansRequest = fromPromise(allPlansRequest());
  }

  get plans() {
    return this.plansRequest?.state === "fulfilled"
      ? this.plansRequest.value.plans
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

  createOrder() {
    assert(this.selectedPlanId !== null);

    this.isCreatingOrder = true;
    createOrderRequest(this.selectedPlanId)
      .then((response) => {
        WebApp.openTelegramLink(response.payLink);
      })
      .finally(
        action(() => {
          this.isCreatingOrder = false;
        }),
      );
  }
}
