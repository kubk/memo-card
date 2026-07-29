import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ShadcnCheckbox } from "../src/ui/shadcn/checkbox.tsx";
import { ShadcnLabel } from "../src/ui/shadcn/label.tsx";

export const PropsPanelContext = createContext<HTMLDivElement | null>(null);

export function PropsPanel({ children }: { children: ReactNode }) {
  const container = useContext(PropsPanelContext);
  return container ? createPortal(children, container) : null;
}

export function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full max-w-[320px] place-items-center text-[var(--tg-theme-text-color)]">
      {children}
    </div>
  );
}

export function PropGroup({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <section className="border-t border-border py-[18px] first:border-t-0">
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
