import DOMPurify from "dompurify";
import { mathmlTagNames } from "mathml-tag-names";

const allowedTags = [
  // Text Formatting Tags

  "a", // Link
  "small", // Small text
  "big", // Big text
  "br", // Line break
  "p", // Paragraph
  "i", // Italic
  "font", // Font for color
  "h1", // Heading 1
  "h2", // Heading 2
  "h3", // Heading 3
  "h4", // Heading 4
  "h5", // Heading 5
  "h6", // Heading 6
  "em", // Emphasized text
  "strong", // Strongly emphasized text
  "b", // Bold
  "mark", // Marked or highlighted text
  "sub", // Subscript
  "sup", // Superscript
  "pre", // Preformatted text
  "blockquote", // Blockquote
  "q", // Inline quote

  // List Tags
  "ul", // Unordered list
  "ol", // Ordered list
  "li", // List item

  // html table tags
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",

  ...mathmlTagNames,
];

export const sanitizeTextForCard = (text: string) => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ["href", "color"],
  });
};
