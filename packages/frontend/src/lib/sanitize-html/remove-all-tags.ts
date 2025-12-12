import DOMPurify from "dompurify";
import { extractImageUrl } from "../card-image/card-image";
import { t } from "../../translations/t.ts";

export function removeAllTags({
  text,
  fallback = true,
}: {
  text: string;
  fallback?: boolean;
}) {
  const sanitized = DOMPurify.sanitize(text, {
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
