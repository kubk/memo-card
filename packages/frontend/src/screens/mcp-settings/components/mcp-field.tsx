import { CopyableValue } from "./copyable-value.tsx";

export function McpField({
  className,
  label,
  value,
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div className={className}>
      <div className="text-xs font-medium text-hint">{label}</div>
      <CopyableValue className="mt-1.5" value={value} />
    </div>
  );
}
