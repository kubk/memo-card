import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MemoCard",
  keywords: [
    "memocard",
    "альтернатива anki",
    "додаток для карток",
    "картки flash ai",
    "створити картки flash ai",
  ],
  description:
    "Покращуйте свою пам'ять за допомогою інтервального повторення. Вивчайте мови, історію або інші предмети за допомогою перевіреного методу карток.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
