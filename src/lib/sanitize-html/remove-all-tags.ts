import sanitizeHtml from "sanitize-html";

export const removeAllTags = (html: string) => {
  return sanitizeHtml(html);
};
