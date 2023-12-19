const SPECIAL_CHARS = [
  "_",
  "*",
  "[",
  "]",
  "(",
  ")",
  "~",
  "`",
  ">",
  "<",
  "&",
  "#",
  "+",
  "-",
  "=",
  "|",
  "{",
  "}",
  ".",
  "!"
];

// https://core.telegram.org/bots/api#markdownv2-style
export const escapeMarkdown = (text: string) => {
  SPECIAL_CHARS.forEach(char => {
    const regex = new RegExp(`\\${char}`, 'g');
    text = text.replace(regex, `\\${char}`);
  });
  return text;
};
