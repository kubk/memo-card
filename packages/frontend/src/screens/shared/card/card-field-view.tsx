import { sanitizeTextForCard } from "../../../lib/sanitize-html/sanitize-text-for-card.ts";

export function CardFieldView(props: { text: string }) {
  const { text } = props;
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: sanitizeTextForCard(text),
      }}
    />
  );
}
