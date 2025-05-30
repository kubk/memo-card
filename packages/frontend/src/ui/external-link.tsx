import { ReactNode } from "react";
import { platform } from "../lib/platform/platform.ts";

type Props = {
  href: string;
  children: ReactNode;
};

export function ExternalLink(props: Props) {
  const { href, children } = props;
  return (
    <span
      onClick={() => {
        platform.openExternalLink(href);
      }}
      className="text-button cursor-pointer"
    >
      {children}
    </span>
  );
}
