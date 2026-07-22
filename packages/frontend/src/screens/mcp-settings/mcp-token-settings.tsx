import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { McpTokenSettingsContent } from "./mcp-token-settings-content.tsx";
import { useMcpSettingsStore } from "./store/mcp-settings-store-context.tsx";

export function McpTokenSettings() {
  const store = useMcpSettingsStore();

  if (store.isLoading) {
    return <FullScreenLoader />;
  }

  if (store.hasLoadError || !store.connectionUrl) {
    return <McpTokenSettingsError />;
  }

  return <McpTokenSettingsContent />;
}

function McpTokenSettingsError() {
  const store = useMcpSettingsStore();
  useBackButton(store.goBack);
  return <ErrorScreen />;
}
