import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { Screen } from "../shared/screen.tsx";
import { McpTokenSettingsContent } from "./mcp-token-settings-content.tsx";
import {
  McpWizardStoreProvider,
  useMcpWizardStore,
} from "./store/mcp-wizard-store-context.tsx";
import { McpWizardStore } from "./store/mcp-wizard-store.ts";

export function McpSettingsWizard({ store }: { store: McpWizardStore }) {
  return (
    <McpWizardStoreProvider store={store}>
      <Screen>
        <McpTokenSettings />
      </Screen>
    </McpWizardStoreProvider>
  );
}

function McpTokenSettings() {
  const store = useMcpWizardStore();

  if (store.mcpTokenQuery.isPending) {
    return <FullScreenLoader />;
  }

  if (store.mcpTokenQuery.error || !store.connectionUrl) {
    return <McpTokenSettingsError />;
  }

  return <McpTokenSettingsContent />;
}

function McpTokenSettingsError() {
  useBackButton(() => screenStore.back());
  return <ErrorScreen />;
}
