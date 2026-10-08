import { assert } from "api";
import { createContext, ReactNode, useContext, useState } from "preact/compat";
import { McpSettingsStore } from "./mcp-settings-store.ts";

const Context = createContext<McpSettingsStore | null>(null);

export function McpSettingsStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [store] = useState(() => new McpSettingsStore());
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useMcpSettingsStore() {
  const store = useContext(Context);
  assert(store, "McpSettingsStoreProvider not found");
  return store;
}
