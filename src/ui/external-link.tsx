import { ReactNode } from "react";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import { platform } from "../lib/platform/platform.ts";

type Props = {
  href: string;
  children: ReactNode;
};

export const ExternalLink = (props: Props) => {
  const { href, children } = props;
  return (
    <span
      onClick={() => {
        platform.openExternalLink(href);
      }}
      className={css({
        color: theme.buttonColor,
        cursor: "pointer",
      })}
    >
      {children}
    </span>
  );
};
