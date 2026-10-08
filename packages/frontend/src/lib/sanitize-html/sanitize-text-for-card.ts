import DOMPurify from "dompurify";
import { mathmlTagNames } from "mathml-tag-names";
import { env } from "../../env";

const allowedTags = [
  // Text Formatting Tags

  "a",
  "small",
  "big",
  "br",
  "div", // Contenteditable emits divs for paragraph blocks.
  "p",
  "i",
  "font", // Preserve text color emitted by contenteditable.
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "em",
  "strong",
  "b",
  "mark",
  "sub",
  "sup",
  "pre",
  "blockquote",
  "q",

  // List Tags
  "ul",
  "ol",
  "li",

  "mark",

  // html table tags
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",

  // image tag
  "img",

  ...mathmlTagNames,
];

DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
  if (data.attrName === "src" && node.tagName === "IMG") {
    const src = data.attrValue;
    if (!src.startsWith(env.VITE_R2_PUBLIC_URL)) {
      data.keepAttr = false;
    }
  }
});

export const sanitizeTextForCard = (text: string) => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ["href", "color", "src"],
  });
};
