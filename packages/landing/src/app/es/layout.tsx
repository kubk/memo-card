import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MemoCard",
  keywords: [
    "memocard",
    "alternativa a anki",
    "aplicación de tarjetas",
    "repetición espaciada",
  ],
  description:
    "Mejora tu memoria con la repetición espaciada. Aprende idiomas, historia u otras materias con el método de tarjetas flash probado.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
