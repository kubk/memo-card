import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function HintTransparent(props: Props) {
  const { children } = props;

  return (
    <div className="text-sm px-3 pt-1 rounded-xl text-hint normal-case">
      {children}
    </div>
  );
}
