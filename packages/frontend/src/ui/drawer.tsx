import { type ComponentProps } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "./cn.ts";

export function Drawer({
  shouldScaleBackground = false,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}

export function DrawerContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-bottom-sheet-bg bg-black/50" />
      <DrawerPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-bottom-sheet-fg flex h-auto flex-col rounded-t-[20px] bg-bg p-5 text-text focus:outline-none",
          className,
        )}
        {...props}
      >
        <DrawerPrimitive.Handle className="!absolute !left-1/2 !top-2 !m-0 !h-1 !w-10 !-translate-x-1/2 !bg-hint !opacity-40" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}

export function DrawerTitle(
  props: ComponentProps<typeof DrawerPrimitive.Title>,
) {
  return <DrawerPrimitive.Title {...props} />;
}
