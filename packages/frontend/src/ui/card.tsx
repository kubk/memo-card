import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

export function Card(props: Props) {
  return (
    <label
      onClick={props.onClick}
      className="bg-bg rounded-xl box-border p-3 flex justify-between items-center cursor-pointer"
    >
      {props.children}
    </label>
  );
}
