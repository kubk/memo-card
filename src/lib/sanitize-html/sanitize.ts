import sanitizeHtml from "sanitize-html";
import { mathmlTagNames } from "mathml-tag-names";

const allowedTags = [
  "small",
  "a",
  "big",
  "br",
  "b",
  "font",
  "i",
  ...mathmlTagNames,
];

export const sanitize = (text: string) => {
  return sanitizeHtml(text, {
    allowedTags: allowedTags,
    allowedAttributes: {
      a: ["href"],
      font: ["color"],
    },
  });
};
