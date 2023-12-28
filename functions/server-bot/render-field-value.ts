import { escapeMarkdown } from "./escape-markdown.ts";

export const renderFieldValue = (value: string | null) => {
  if (!value) {
    return "_None_";
  }

  return escapeMarkdown(value);
};
