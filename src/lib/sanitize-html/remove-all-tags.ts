import sanitizeHtml from "sanitize-html";

export const removeAllTags = (text: string) => {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
