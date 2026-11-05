import DOMPurify from "dompurify";

// Keeps formatting but drops scripts and event handlers before stored card
// HTML reaches the editor's innerHTML
export const sanitizeEditorHtml = (html: string) => DOMPurify.sanitize(html);
