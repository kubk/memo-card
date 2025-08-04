import { m } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "../cn";
import { userStore } from "../../store/user-store";

export function AnimatedDropdownBody({
  children,
  origin,
}: {
  children: ReactNode;
  origin: "top" | "bottom";
}) {
  return (
    <m.div
      className={cn(
        "absolute bottom-16 bg-bg rounded-xl shadow-lg border border-secondary-bg overflow-hidden z-10 end-0",
      )}
      initial={{
        opacity: 0,
        scale: 0.8,
        transformOrigin:
          origin === "top"
            ? userStore.isRtl
              ? "top left"
              : "top right"
            : userStore.isRtl
              ? "bottom left"
              : "bottom right",
      }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </m.div>
  );
}
