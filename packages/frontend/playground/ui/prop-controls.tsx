import { type ReactNode } from "preact/compat";
import { ShadcnCheckbox } from "../../src/ui/shadcn/checkbox.tsx";
import { ShadcnInput } from "../../src/ui/shadcn/input.tsx";
import { ShadcnLabel } from "../../src/ui/shadcn/label.tsx";

export function PropGroup({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <section className="py-3">
      {label && (
        <h3 className="mb-3.5 text-xs font-semibold text-muted-foreground">
          {label}
        </h3>
      )}
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

export function BooleanProp({
  checked,
  id,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex min-h-7 items-center justify-between gap-4">
      <ShadcnLabel htmlFor={id}>{label}</ShadcnLabel>
      <ShadcnCheckbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
    </div>
  );
}

export function TextProp({
  id,
  label,
  onChange,
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <ShadcnLabel htmlFor={id}>{label}</ShadcnLabel>
      <ShadcnInput
        id={id}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </div>
  );
}
