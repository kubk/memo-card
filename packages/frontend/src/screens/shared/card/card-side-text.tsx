import { Volume2 } from "lucide-react";
import { removeAllTags } from "../../../lib/sanitize-html/remove-all-tags.ts";

// A side with neither text nor image only plays audio
export function CardSideText({ text }: { text: string }) {
  return (
    removeAllTags({ text }) || (
      <Volume2 className="inline align-[-3px]" size={16} />
    )
  );
}
