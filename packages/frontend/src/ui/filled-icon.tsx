import { ReactNode } from "react";

type Props = {
  backgroundColor: string;
  icon: ReactNode;
};

export function FilledIcon({ backgroundColor, icon }: Props) {
  return (
    <div
      style={{ backgroundColor }}
      className="rounded-lg w-[30px] h-[30px] flex justify-center text-white items-center"
    >
      {icon}
    </div>
  );
}

export function TransparentIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="rounded-lg w-[30px] h-[30px] flex justify-center items-center">
      {icon}
    </div>
  );
}
