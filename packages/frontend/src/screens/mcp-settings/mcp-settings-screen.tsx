import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { Screen } from "../shared/screen.tsx";
import { McpTokenSettingsContent } from "./mcp-token-settings-content.tsx";
import {
  McpSettingsStoreProvider,
  useMcpSettingsStore,
} from "./store/mcp-settings-store-context.tsx";

export function McpSettingsScreen() {
  return (
    <McpSettingsStoreProvider>
      <Screen>
        <McpTokenSettings />
      </Screen>
    </McpSettingsStoreProvider>
  );
}

function McpTokenSettings() {
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
  useBackButton(() => screenStore.back());
  return <ErrorScreen />;
}
