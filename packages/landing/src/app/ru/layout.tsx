import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MemoCard",
  keywords: [
    "memocard",
    "anki альтернатива",
    "flashcard приложение",
    "интервальное повторение",
    "flashcards ai",
    "создание ai карточек",
    "memocard ai",
  ],
  description:
    "Улучшите свою память с помощью интервального повторения. Изучайте языки, историю или другие предметы с помощью проверенного метода карточек.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
