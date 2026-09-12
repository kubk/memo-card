import { Button } from "../../../ui/button.tsx";
import { useMcpSettingsStore } from "../store/mcp-settings-store-context.tsx";
import { mcpT } from "../translations.ts";

export function McpConnections() {
  const store = useMcpSettingsStore();
  const query = store.connectionsQuery;
  const data = query.data;

  if (!data || data.connections.length === 0) return null;

  return (
    <div className="mt-6 w-full">
      <div className="mt-4 rounded-2xl bg-secondary-bg p-4">
        <h3 className="font-semibold">{mcpT("connectedApps")}</h3>
        <p className="mt-1 text-sm text-hint">{mcpT("stayConnected")}</p>
        {data.connections.map((connection) => (
          <div key={connection.id} className="mt-4 flex items-center gap-3">
            <span className="min-w-0 flex-1 break-words text-sm">
              {connection.name}
            </span>
            <Button
              outline
              className="w-auto shrink-0"
              disabled={store.disconnectingId !== null}
              onClick={() => store.disconnect(connection.id)}
            >
              {mcpT("disconnect")}
            </Button>
          </div>
        ))}
        {store.disconnectFailed && (
          <p className="mt-3 text-sm text-hint">{mcpT("disconnectError")}</p>
        )}
      </div>
    </div>
  );
}
