import { makeAutoObservable } from "mobx";
import { api, apiProxy } from "../../../api/trpc-api.ts";
import { env } from "../../../env.ts";
import { makeMutation } from "../../../lib/mobx-query-lite/make-mutation.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { showConfirm } from "../../../lib/platform/show-confirm.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { userStore } from "../../../store/user-store.ts";
import { t } from "../../../translations/t.ts";
import { mcpT } from "../translations.ts";

export const MCP_WIZARD_STEPS = [1, 2, 3] as const;
type McpWizardStep = (typeof MCP_WIZARD_STEPS)[number];
type UserStoreLike = Pick<
  typeof userStore,
  "activePlanQuery" | "canCancelSubscription" | "paidUntil" | "plan"
>;

export class McpWizardStore {
  step: McpWizardStep = 1;
  isGuideOpen = false;

  constructor(
    public mcpTokenQuery = makeQuery(apiProxy.mcpToken.getMyToken.query),
    public accountStore: UserStoreLike = userStore,
    public cancelSubscriptionMutation = makeMutation(
      api.cancelStripeSubscription.mutate,
    ),
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get connectionUrl() {
    const token = this.mcpTokenQuery.data?.token;
    if (!token) {
      return null;
    }

    const url = new URL("/mcp", env.VITE_API_URL);
    url.searchParams.set("token", token);
    return url.toString();
  }

  get isConfigured() {
    return this.mcpTokenQuery.data?.status === "used";
  }

  get planDateTextParts() {
    const messageKey = this.accountStore.plan?.subscription?.willRenew
      ? "payment_renews_on"
      : "payment_until_date";
    const [before, after = ""] = t(messageKey).split("{date}");
    return { before, after };
  }

  get title() {
    if (this.step === 2) {
      return mcpT("openChatGptTitle");
    }

    return mcpT("tryAgentTitle");
  }

  get mainButtonText() {
    if (this.isGuideOpen) {
      return t("go_back");
    }

    if (this.isConfigured) {
      return mcpT("doneButton");
    }

    if (this.step === 1) {
      return mcpT("startButton");
    }

    if (this.step === 2) {
      return mcpT("addedButton");
    }

    return mcpT("doneButton");
  }

  goToStep(step: McpWizardStep) {
    this.step = step;
  }

  openGuide() {
    this.step = 2;
    this.isGuideOpen = true;
  }

  closeGuide() {
    this.isGuideOpen = false;
  }

  async cancelSubscription() {
    if (
      !this.accountStore.canCancelSubscription ||
      this.cancelSubscriptionMutation.isPending
    ) {
      return;
    }

    if (!(await showConfirm(t("payment_cancel_subscription_confirm")))) {
      return;
    }

    const result = await this.cancelSubscriptionMutation.mutateResult();
    if (!result.ok) {
      return;
    }

    this.accountStore.activePlanQuery.setData(result.data);
    await this.accountStore.activePlanQuery.invalidate();
  }

  submitCurrentStep() {
    if (this.isGuideOpen) {
      this.closeGuide();
      return;
    }

    if (this.isConfigured) {
      screenStore.back();
      return;
    }

    if (this.step === 1) {
      this.step = 2;
      return;
    }

    if (this.step === 2) {
      this.step = 3;
      return;
    }

    screenStore.back();
  }
}
