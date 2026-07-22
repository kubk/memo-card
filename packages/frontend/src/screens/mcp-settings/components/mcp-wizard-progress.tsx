import { MCP_WIZARD_STEP_COUNT } from "../store/mcp-settings-store.ts";
import { useMcpSettingsStore } from "../store/mcp-settings-store-context.tsx";

export function McpWizardProgress() {
  const store = useMcpSettingsStore();

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: MCP_WIZARD_STEP_COUNT }, (_, index) => (
          <div
            className={`h-1.5 rounded-full transition-colors duration-200 ${
              index < store.step ? "bg-button" : "bg-[#767680]/30"
            }`}
            key={index}
          />
        ))}
      </div>
      <div className="mt-2 text-center text-xs font-medium text-hint">
        {store.step} / {MCP_WIZARD_STEP_COUNT}
      </div>
    </div>
  );
}
