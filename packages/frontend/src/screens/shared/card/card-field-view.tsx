import { applyDeckVariables } from "api";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { sanitizeTextForCard } from "../../../lib/sanitize-html/sanitize-text-for-card.ts";
import { toViewerMediaUrls } from "../../../lib/urls/proxy-urls.ts";

export function CardFieldView(props: { text: string }) {
  const { text } = props;
  return (
    <span
      className="whitespace-pre-wrap [&_img]:max-w-[300px] [&_img]:max-h-[300px] [&_img]:rounded-lg"
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
