import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export function CenteredUnstyledButton(props: Props) {
  const { children, onClick } = props;

  return (
    <button
      className={
        "reset-button w-full text-link text-sm pt-1.5 uppercase active:scale-[0.97]"
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
