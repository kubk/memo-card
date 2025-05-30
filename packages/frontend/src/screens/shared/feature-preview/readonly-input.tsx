import { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  children?: ReactNode;
};

export function ReadonlyInput(props: Props) {
  const { label, value, children } = props;

  return (
    <div className="mb-2">
      <div className="font-semibold text-sm mb-1">{label}</div>
      <div className="p-[8px_8px] rounded-[10px] box-border w-full bg-secondary-bg text-sm">
        {value}
      </div>
      {children}
    </div>
  );
}
