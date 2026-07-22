import { MCP_WIZARD_STEPS } from "../store/mcp-settings-store.ts";
import { useMcpSettingsStore } from "../store/mcp-settings-store-context.tsx";

export function McpWizardProgress() {
  const store = useMcpSettingsStore();

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {MCP_WIZARD_STEPS.map((step) => (
          <button
            className={`relative h-1.5 rounded-full transition-colors duration-200 before:absolute before:-inset-y-2 before:inset-x-0 ${
              step <= store.step ? "bg-button" : "bg-[#767680]/30"
            }`}
            key={step}
            onClick={() => store.goToStep(step)}
            title={`${step} / ${MCP_WIZARD_STEPS.length}`}
            type="button"
          />
        ))}
      </div>
      <div className="mt-2 text-center text-xs font-medium text-hint">
        {store.step} / {MCP_WIZARD_STEPS.length}
      </div>
    </div>
  );
}
