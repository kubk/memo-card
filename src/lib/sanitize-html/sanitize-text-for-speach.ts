import sanitizeHtml from "sanitize-html";

export const sanitizeTextForSpeach = (html: string) => {
  return sanitizeHtml(html);
};
