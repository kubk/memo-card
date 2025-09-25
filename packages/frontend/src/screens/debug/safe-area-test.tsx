export function SafeAreaTest() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold text-text">Safe Area Test</h1>
      <pre>
        {JSON.stringify(
          {
            pt: getComputedStyle(document.documentElement).getPropertyValue(
              "env(safe-area-inset-top)",
            ),

            pb: getComputedStyle(document.documentElement).getPropertyValue(
              "env(safe-area-inset-bottom)",
            ),
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
