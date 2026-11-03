import { applyDeckVariables } from "api";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { Volume2 } from "lucide-react";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";

export function CardSideText({ text }: { text: string }) {
  return (
    removeAllTags({
      text: applyDeckVariables(text, deckListStore.deckVariables),
    }) || <Volume2 className="inline align-[-3px]" size={16} />
  );
}
