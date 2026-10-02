import { useEffect } from "react";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { Screen } from "../shared/screen.tsx";
import { McpConnections } from "./components/mcp-connections.tsx";
import { McpIntroStep } from "./components/mcp-intro-step.tsx";
import {
  McpSettingsStoreProvider,
  useMcpSettingsStore,
} from "./store/mcp-settings-store-context.tsx";
import { t } from "../../translations/t.ts";

export function McpSettingsScreen() {
  return (
    <McpSettingsStoreProvider>
      <Screen>
        <McpSettingsContent />
      </Screen>
    </McpSettingsStoreProvider>
  );
}

function McpSettingsContent() {
  const store = useMcpSettingsStore();
  useBackButton(() => screenStore.back());
  useMainButton(() => store.mainButtonText, store.connect);

  // Refetch when returning from the external ChatGPT OAuth browser: the
  // webview survives the round-trip, so the connection list would be stale.
  useEffect(() => {
    function refreshConnections() {
      if (document.visibilityState === "visible") {
        return store.connectionsQuery.invalidate();
      }
    }
    document.addEventListener("visibilitychange", refreshConnections);
    return () =>
      document.removeEventListener("visibilitychange", refreshConnections);
  }, [store]);

  if (store.connectionsQuery.isPending) return <FullScreenLoader />;
  if (store.connectionsQuery.error) return <ErrorScreen />;

  return (
    <div className="mx-auto flex min-h-[calc(100vh_-_120px)] w-full max-w-[430px] flex-col items-center justify-center px-5 py-8">
      <McpIntroStep />
      <p className="mt-4 text-center text-sm text-hint">
        {store.connectionsQuery.data?.pluginUrl
          ? t("telegramSetup")
          : t("pluginComingSoon")}
      </p>
      <McpConnections />
    </div>
  );
}
