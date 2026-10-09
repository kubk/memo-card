import { makeAutoObservable, reaction, runInAction } from "mobx";
import { BooleanToggle } from "mobx-form-lite";
import { type PaidPlanType } from "api";
import { api } from "../../api/trpc-api.ts";
import { persistableField } from "../../lib/mobx-form-lite-persistable/persistable-field.ts";
import { makeMutation } from "../../lib/mobx-query-lite/make-mutation.ts";
import { isRunningWithinTelegram } from "../../lib/platform/is-running-within-telegram.ts";
import { userStore } from "../../store/user-store.ts";
import { notifyError, notifySuccess } from "../shared/snackbar/snackbar.tsx";

export class DevMenuStore {
  isErudaEnabled = persistableField(new BooleanToggle(false), "isErudaEnabled");
  setDevPlanMutation = makeMutation(api.setDevPlan.mutate);
  pendingPlan: "none" | PaidPlanType | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    if (isRunningWithinTelegram()) {
      reaction(
        () => this.isErudaEnabled.value,
        (enabled) => {
          if (enabled) {
            this.addErudaToDom();
          } else {
            this.removeErudaFromDom();
          }
        },
        { fireImmediately: true },
      );
    }
  }

  get planValue(): "none" | PaidPlanType {
    return userStore.plan?.type === "pro" || userStore.plan?.type === "teacher"
      ? userStore.plan.type
      : "none";
  }

  async setDevPlan(planType: PaidPlanType | null) {
    if (this.pendingPlan !== null) {
      return;
    }

    this.pendingPlan = planType ?? "none";

    try {
      const result = await this.setDevPlanMutation.mutateResult({ planType });

      if (!result.ok) {
        notifyError({ e: result.error, info: "Failed to update paid status" });
        return;
      }

      userStore.setActivePlan(result.data.plan);

      notifySuccess(
        planType ? `Plan set to ${planType}` : "Paid status disabled",
      );
    } finally {
      runInAction(() => {
        this.pendingPlan = null;
      });
    }
  }

  private addErudaToDom() {
    if (document.getElementById("eruda-script")) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.id = "eruda-script";
    script.onload = () => {
      // @ts-ignore
      window.eruda.init();
    };
    document.body.appendChild(script);
  }

  private removeErudaFromDom() {
    // @ts-ignore
    if (window.eruda) {
      // @ts-ignore
      window.eruda.destroy();
    }
    document.getElementById("eruda-script")?.remove();
  }
}
