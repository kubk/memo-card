import { createFileRoute } from "@tanstack/react-router";
import { ConnectToClaudePage } from "@/components/landing-page/connectToClaudePage";

export const Route = createFileRoute("/connect-to-claude")({
  head: () => ({
    meta: [
      { title: "Connect MemoCard to Claude" },
      {
        name: "description",
        content:
          "Create, find, improve and organize MemoCard flashcards from Claude",
      },
    ],
  }),
  component: ConnectToClaudePage,
});
