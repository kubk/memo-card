import { ReactNode } from "react";
import { css } from "@emotion/css";
import WebApp from "@twa-dev/sdk";
import { theme } from "./theme.tsx";

export const ExternalLink = (props: { href: string; children: ReactNode }) => {
  const { href, children } = props;
  return (
    <span
      onClick={() => {
        WebApp.openLink(href);
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
