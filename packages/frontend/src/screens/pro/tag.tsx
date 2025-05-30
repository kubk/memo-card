import { ReactNode } from "react";

type Props = { text: ReactNode };

export function Tag({ text }: Props) {
  return (
    <div className="text-button-text bg-success font-semibold rounded text-xs py-0 px-1 flex justify-center items-center">
      {text}
    </div>
  );
}
