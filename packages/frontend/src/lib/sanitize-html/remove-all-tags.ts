import DOMPurify from "dompurify";
import { extractImageUrl } from "../card-image/card-image";
import { t } from "../../translations/t.ts";

const lineBreakPattern = /(?:\s*<br\s*\/?>\s*)+/gi;

export function removeAllTags({
  text,
  fallback = true,
}: {
  text: string;
  fallback?: boolean;
}) {
  const textWithLineBreaks = text.replace(lineBreakPattern, " ");
  const sanitized = DOMPurify.sanitize(textWithLineBreaks, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).replace(/&nbsp;/g, "");

  const sanitizedTrimmed = sanitized.trim();
  if (sanitizedTrimmed) {
    return sanitizedTrimmed;
  }
  if (fallback && !!extractImageUrl(text)) {
    return t("image");
  }
  return "";
}
