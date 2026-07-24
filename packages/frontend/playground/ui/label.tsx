import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../src/ui/cn.ts";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export function ShadcnLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) {
  return (
    <LabelPrimitive.Root
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
}
