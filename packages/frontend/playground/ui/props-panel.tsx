import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const PropsPanelContext = createContext<HTMLDivElement | null>(null);

export function PropsPanel({ children }: { children: ReactNode }) {
  const container = useContext(PropsPanelContext);
  return container ? createPortal(children, container) : null;
}
