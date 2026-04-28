import { sanitizeTextForCard } from "../../../lib/sanitize-html/sanitize-text-for-card.ts";

export function CardFieldView(props: { text: string }) {
  const { text } = props;
  return (
    <span
      className="whitespace-pre-wrap [&_img]:max-w-[300px] [&_img]:max-h-[300px] [&_img]:rounded-lg"
      dangerouslySetInnerHTML={{
        __html: sanitizeTextForCard(text),
      }}
    />
  );
}
