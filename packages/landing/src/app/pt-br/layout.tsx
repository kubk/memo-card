import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MemoCard",
  keywords: [
    "memocard",
    "alternativa ao anki",
    "aplicativo de cartões",
    "cartões flash ai",
    "criar cartões flash ai",
  ],
  description:
    "Melhore sua memória com a repetição espaçada. Aprenda idiomas, história ou outras matérias com o método de cartões flash comprovado.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
