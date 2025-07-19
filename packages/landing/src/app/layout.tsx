import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cn } from "@/lib/utils";
import { links } from "api";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MemoCard",
  alternates: {
    canonical: links.landing,
    languages: {
      ru: `${links.landing}/ru/`,
      es: `${links.landing}/es/`,
      "pt-br": `${links.landing}/pt-br/`,
      uk: `${links.landing}/uk/`,
    },
  },
  keywords: [
    "memocard",
    "anki alternative",
    "flashcard app",
    "flashcards ai",
    "create ai flashcards",
    "memocard ai",
  ],
  description:
    "Improve your memory with spaced repetition. Learn languages, history or other subjects with the proven flashcard method.",
};

export default function RootLayout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <html lang={"en"}>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-Z45JH1JS3K" />
      )}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
