import { makeAutoObservable } from "mobx";
import { apiProxy } from "../../../api/trpc-api.ts";
import { env } from "../../../env.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { mcpT } from "../translations.ts";

export const MCP_WIZARD_STEP_COUNT = 3;
type McpWizardStep = 1 | 2 | 3;

export class McpSettingsStore {
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

  get isLoading() {
    return this.mcpTokenQuery.isPending;
  }

  get hasLoadError() {
    return this.mcpTokenQuery.error !== null;
  }

  get title() {
    if (this.step === 2) {
      return mcpT("openChatGptTitle");
    }

    return mcpT("tryAgentTitle");
  }

  get mainButtonText() {
    if (this.step === 1) {
      return mcpT("startButton");
    }

    if (this.step === 2) {
      return mcpT("addedButton");
    }

    return mcpT("quitButton");
  }

  goBack() {
    if (this.step === 3) {
      this.step = 2;
      return;
    }

    if (this.step === 2) {
      this.step = 1;
      return;
    }

    screenStore.back();
  }

  submitCurrentStep() {
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
