import { Screen } from "../shared/screen.tsx";
import { McpTokenSettings } from "./mcp-token-settings.tsx";
import { McpSettingsStoreProvider } from "./store/mcp-settings-store-context.tsx";

export function McpSettingsScreen() {
  return (
    <McpSettingsStoreProvider>
      <Screen>
        <McpTokenSettings />
      </Screen>
    </McpSettingsStoreProvider>
  );
}
