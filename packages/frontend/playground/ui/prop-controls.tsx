import { type ReactNode } from "preact/compat";
import { ShadcnCheckbox } from "../../src/ui/shadcn/checkbox.tsx";
import { ShadcnInput } from "../../src/ui/shadcn/input.tsx";
import { ShadcnLabel } from "../../src/ui/shadcn/label.tsx";
import {
  ShadcnRadioGroup,
  ShadcnRadioGroupItem,
} from "../../src/ui/shadcn/radio-group.tsx";
import { cn } from "../../src/ui/cn.ts";

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

export function RadioProp({
  id,
  options,
  value,
  onValueChange,
}: {
  id: string;
  options: ReadonlyArray<{ id: string; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <ShadcnRadioGroup
      className="w-full gap-1 rounded-lg bg-muted p-1"
      orientation="vertical"
      value={value}
      onValueChange={onValueChange}
    >
      {options.map((option) => {
        const optionId = `${id}-${option.id}`;
        return (
          <div
            className={cn(
              "flex min-h-9 items-center gap-3 rounded-md px-3 py-2",
              value === option.id
                ? "bg-background text-link"
                : "text-foreground",
            )}
            key={option.id}
          >
            <ShadcnRadioGroupItem id={optionId} value={option.id} />
            <ShadcnLabel
              className="min-w-0 flex-1 cursor-pointer whitespace-normal"
              htmlFor={optionId}
            >
              {option.label}
            </ShadcnLabel>
          </div>
        );
      })}
    </ShadcnRadioGroup>
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
