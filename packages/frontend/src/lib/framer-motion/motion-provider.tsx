import { domMin, LazyMotion } from "motion/react";
import { ReactNode } from "preact/compat";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMin} strict>
      {children}
    </LazyMotion>
  );
}
