import { applyDeckVariables } from "api";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { sanitizeTextForCard } from "../../../lib/sanitize-html/sanitize-text-for-card.ts";
import { toViewerMediaUrls } from "../../../lib/urls/proxy-urls.ts";

export function CardFieldView(props: { text: string }) {
  const { text } = props;
  return (
    <span
      className="whitespace-pre-wrap [&_img]:max-w-75 [&_img]:max-h-75 [&_img]:rounded-lg"
      dangerouslySetInnerHTML={{
        __html: toViewerMediaUrls(
          sanitizeTextForCard(
            applyDeckVariables(text, deckListStore.deckVariables),
          ),
        ),
      }}
    />
  );
}
