import sanitizeHtml from "sanitize-html";
import { mathmlTagNames } from "mathml-tag-names";

const allowedTags = [
  // Text Formatting Tags

  'a', // Link
  "small", // Small text
  "big", // Big text
  "br", // Line break
  'p', // Paragraph
  "i", // Italic
  "font", // Font for color
  'h1', // Heading 1
  'h2', // Heading 2
  'h3', // Heading 3
  'h4', // Heading 4
  'h5', // Heading 5
  'h6', // Heading 6
  'em', // Emphasized text
  'strong', // Strongly emphasized text
  "b", // Bold
  'mark', // Marked or highlighted text
  'sub', // Subscript
  'sup', // Superscript
  'pre', // Preformatted text
  'blockquote', // Blockquote
  'q', // Inline quote

  // List Tags
  'ul', // Unordered list
  'ol', // Ordered list
  'li', // List item

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
