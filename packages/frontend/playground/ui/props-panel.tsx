import { createContext, useContext, type ReactNode } from "preact/compat";
import { createPortal } from "preact/compat";

export const PropsPanelContext = createContext<HTMLDivElement | null>(null);

export function PropsPanel({ children }: { children: ReactNode }) {
  const container = useContext(PropsPanelContext);
  return container ? createPortal(children, container) : null;
}
