import { theme } from "../theme.tsx";

export function ColorPickerIcon() {
  return (
    <div className="w-[18px] h-[18px] grid grid-cols-2 gap-px overflow-hidden rounded">
      <div className="rounded-ss" style={{ backgroundColor: theme.success }} />
      <div
        className="rounded-se"
        style={{ backgroundColor: theme.icons.blue }}
      />
      <div className="rounded-es" style={{ backgroundColor: theme.orange }} />
      <div className="rounded-ee" style={{ backgroundColor: theme.danger }} />
    </div>
  );
}
