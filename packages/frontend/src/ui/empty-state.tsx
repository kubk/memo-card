import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function EmptyState(props: Props) {
  const { children } = props;

  return (
    <div className="w-full text-center mt-2 text-sm text-hint">{children}</div>
  );
}
