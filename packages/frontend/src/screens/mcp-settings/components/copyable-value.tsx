import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "preact/compat";
import { copyToClipboard } from "../../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { platform } from "../../../lib/platform/platform.ts";

export function CopyableValue({
  className,
  monospace,
  value,
}: {
  className?: string;
  monospace?: boolean;
  value: string;
}) {
  const [copyVersion, setCopyVersion] = useState(0);
  const copied = copyVersion > 0;

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopyVersion(0), 1200);
    return () => window.clearTimeout(timeoutId);
  }, [copyVersion, copied]);

  return (
    <button
      className={`${className ?? ""} relative block w-full cursor-pointer rounded-xl border-0 bg-bg text-start text-text select-none transition-transform duration-150 active:scale-[0.99] ${
        monospace
          ? "max-h-28 overflow-auto break-all p-3 pe-12 font-mono text-xs"
          : "px-3 py-2 pe-12 text-sm font-medium"
      }`}
      type="button"
      onClick={async () => {
        await copyToClipboard(value);
        platform.haptic("success");
        setCopyVersion((version) => version + 1);
      }}
    >
      {value}
      <span
        className="absolute end-2.5 top-1/2 flex size-7 items-center justify-center rounded-full bg-button-outline-bg-light text-link transition-all duration-200 dark:bg-button-outline-bg-dark"
        style={{
          opacity: copied ? 1 : 0,
          transform: `translateY(-50%) scale(${copied ? 1 : 0.75})`,
        }}
      >
        <CheckIcon size={18} strokeWidth={2.5} />
      </span>
    </button>
  );
}
