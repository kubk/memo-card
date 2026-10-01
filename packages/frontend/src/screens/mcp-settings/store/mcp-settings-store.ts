import { makeAutoObservable, runInAction } from "mobx";
import { api, apiProxy } from "../../../api/trpc-api.ts";
import { platform } from "../../../lib/platform/platform.ts";
import { makeQuery } from "../../../lib/mobx-query-lite/make-query.ts";
import { screenStore } from "../../../store/screen-store.ts";
import { mcpT } from "../translations.ts";

export class McpSettingsStore {
  connectionsQuery = makeQuery(apiProxy.mcpOAuth.connections.query);
  disconnectingId: string | null = null;
  disconnectFailed = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get mainButtonText() {
    return this.connectionsQuery.data?.pluginUrl
      ? mcpT("openPlugin")
      : mcpT("doneButton");
  }

  connect() {
    const url = this.connectionsQuery.data?.pluginUrl;
    if (url) platform.openExternalLink(url);
    else screenStore.back();
  }

  async disconnect(grantId: string) {
    if (this.disconnectingId) return;
    this.disconnectingId = grantId;
    this.disconnectFailed = false;
    try {
      await api.mcpOAuth.disconnect.mutate({ grantId });
      await this.connectionsQuery.invalidate();
    } catch {
      runInAction(() => {
        this.disconnectFailed = true;
      });
    } finally {
      runInAction(() => {
        this.disconnectingId = null;
      });
    }
  }
}
