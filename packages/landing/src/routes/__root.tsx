import type { ReactNode } from "react";
import {
  createRootRoute,
  HeadContent,
  Scripts,
  useMatches,
} from "@tanstack/react-router";
import interLatinUrl from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import { LandingLanguage, landingLanguages, links } from "api";
import { NotFoundPage } from "@/components/landing-page/notFoundPage";
import appCss from "../styles.css?url";

const googleAnalyticsId = "G-Z45JH1JS3K";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MemoCard" },
    ],
    links: [
      {
        rel: "preload",
        href: interLatinUrl,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: links.landing },
      ...landingLanguages
        .filter((language) => language !== LandingLanguage.en)
        .map((language) => ({
          rel: "alternate",
          hrefLang: language,
          href: `${links.landing}/${language}/`,
        })),
      { rel: "icon", href: "/icon.png", sizes: "27x33", type: "image/png" },
    ],
    scripts: import.meta.env.PROD
      ? [
          {
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
            async: true,
          },
          {
            children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`,
          },
        ]
      : [],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  const language = useMatches({
    select: (matches) =>
      matches.findLast((match) => match.staticData.language)?.staticData
        .language ?? LandingLanguage.en,
  });
  // Cloudflare serves 404.html for unknown paths, so hydrating it would mismatch the router's not-found match
  const isStaticNotFoundPage = useMatches({
    select: (matches) => matches.some((match) => match.routeId === "/404"),
  });

  return (
    <html lang={language}>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        {!isStaticNotFoundPage && <Scripts />}
      </body>
    </html>
  );
}
