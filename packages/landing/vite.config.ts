import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const siteUrl = "https://memocard.org";
const alternativeLanguages = ["ru", "es", "pt-br", "uk"];

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 8080 },
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        autoSubfolderIndex: false,
        failOnError: true,
      },
      pages: [
        {
          path: "/",
          sitemap: {
            changefreq: "daily",
            priority: 0.7,
            alternateRefs: [
              { href: siteUrl, hreflang: "x-default" },
              ...alternativeLanguages.map((language) => ({
                href: `${siteUrl}/${language}`,
                hreflang: language,
              })),
            ],
          },
        },
        ...alternativeLanguages.map((language) => ({
          path: `/${language}`,
          sitemap: { exclude: true },
        })),
        { path: "/404", sitemap: { exclude: true } },
      ],
      sitemap: {
        enabled: true,
        host: siteUrl,
      },
    }),
    tailwindcss(),
    viteReact(),
  ],
});
