import { Label } from "../../../ui/label.tsx";
import { CopyableValue } from "./copyable-value.tsx";

export function McpField({ label, value }: { label: string; value: string }) {
  return (
    <Label isPlain text={label}>
      <CopyableValue value={value} />
    </Label>
  );
}
