import { LabelGroup } from "../../../ui/label-group.tsx";
import { CopyableValue } from "./copyable-value.tsx";

export function McpField({ label, value }: { label: string; value: string }) {
  return (
    <LabelGroup title={label}>
      <CopyableValue value={value} />
    </LabelGroup>
  );
}
