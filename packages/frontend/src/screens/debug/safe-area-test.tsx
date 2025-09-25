import { getSafeAreaValue } from "../../lib/platform/browser/browser-get-safe-area-inset";

export function SafeAreaTest() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold text-text">Safe Area Test</h1>
      <pre>
        {JSON.stringify(
          {
            pv: getComputedStyle(document.documentElement).getPropertyValue(
              "env(safe-area-inset-top)",
            ),
            parsed: getSafeAreaValue("env(safe-area-inset-top)"),
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
