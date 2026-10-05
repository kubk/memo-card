import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "./cn.ts";
import { overlayStore } from "../store/overlay-store.ts";
import { useMount } from "../lib/react/use-mount.ts";

export function Drawer({
  shouldScaleBackground = false,
  title,
  titleClassName,
  contentProps,
  children,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root> & {
  title: ReactNode;
  titleClassName?: string;
  contentProps?: ComponentPropsWithoutRef<typeof DrawerContent>;
}) {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    >
      <DrawerContent {...contentProps}>
        <DrawerPrimitive.Title className={titleClassName}>
          {title}
        </DrawerPrimitive.Title>
        <DrawerOverlayFlag />
        {children}
      </DrawerContent>
    </DrawerPrimitive.Root>
  );
}

function DrawerOverlayFlag() {
  useMount(() => {
    overlayStore.add();
    return () => overlayStore.remove();
  });

  return null;
}

function DrawerContent({
  className,
  children,
  showHandle = true,
  overlayStyle,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content> & {
  showHandle?: boolean;
  overlayStyle?: CSSProperties;
}) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay
        className="fixed inset-0 z-bottom-sheet-bg bg-black/50"
        style={overlayStyle}
      />
      <DrawerPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-bottom-sheet-fg flex h-auto flex-col rounded-t-[20px] bg-bg p-5 text-text focus:outline-hidden",
          className,
        )}
        {...props}
      >
        {showHandle && (
          <DrawerPrimitive.Handle className="!absolute !left-1/2 !top-2 !m-0 !h-1 !w-10 !-translate-x-1/2 !bg-hint !opacity-40" />
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}
