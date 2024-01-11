import sanitizeHtml from "sanitize-html";

export const sanitize = (text: string) => {
  return sanitizeHtml(text, {
    allowedTags: ["small", "a", "big", "br", "b", "font"],
    allowedAttributes: {
      a: ["href"],
      font: ["color"],
    },
  });
};
