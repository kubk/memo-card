import { makeAutoObservable } from "mobx";
import { apiProxy } from "../../../api/trpc-api.ts";
import { env } from "../../../env.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { mcpT } from "../translations.ts";

export const MCP_WIZARD_STEPS = [1, 2, 3] as const;
type McpWizardStep = (typeof MCP_WIZARD_STEPS)[number];

export class McpWizardStore {
  mcpTokenQuery = makeQuery(apiProxy.mcpToken.getMyToken.query);
  step: McpWizardStep = 1;

  constructor() {
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

  get title() {
    if (this.step === 2) {
      return mcpT("openChatGptTitle");
    }

    return mcpT("tryAgentTitle");
  }

  get mainButtonText() {
    if (this.isConfigured) {
      return mcpT("quitButton");
    }

    if (this.step === 1) {
      return mcpT("startButton");
    }

    if (this.step === 2) {
      return mcpT("addedButton");
    }

    return mcpT("quitButton");
  }

  goToStep(step: McpWizardStep) {
    this.step = step;
  }

  submitCurrentStep() {
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
