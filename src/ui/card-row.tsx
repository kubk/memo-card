import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

export const CardRow = observer((props: Props) => {
  return (
    <label
      onClick={props.onClick}
      className="bg-bg rounded-xl h-12 box-border p-3 flex justify-between items-center cursor-pointer"
    >
      {props.children}
    </label>
  );
});
