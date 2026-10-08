import { assert } from "api";
import { createContext, ReactNode, useContext } from "preact/compat";
import { McpWizardStore } from "./mcp-wizard-store.ts";

const Context = createContext<McpWizardStore | null>(null);

export function McpWizardStoreProvider({
  children,
  store,
}: {
  children: ReactNode;
  store: McpWizardStore;
}) {
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useMcpWizardStore() {
  const store = useContext(Context);
  assert(store, "McpWizardStoreProvider not found");
  return store;
}
