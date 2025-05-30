import { ReactNode } from "react";

type Props = { children: ReactNode };

export function ButtonGrid(props: Props) {
  const { children } = props;
  return <div className="grid grid-cols-2 gap-2.5">{children}</div>;
}
