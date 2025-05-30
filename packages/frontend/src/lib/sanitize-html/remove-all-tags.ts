import DOMPurify from "dompurify";

export const removeAllTags = (text: string) => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).replace(/&nbsp;/g, "");
};
