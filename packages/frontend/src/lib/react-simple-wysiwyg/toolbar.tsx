import type { ComponentChildren } from "preact";

export function Toolbar({ children }: { children: ComponentChildren }) {
  return <div className="rsw-toolbar">{children}</div>;
}
