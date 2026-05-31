import { translator } from "./t.ts";

const formatters = new Map<string, Intl.NumberFormat>();

export const formatNumber = (value: number) => {
  const language = translator.getLang();
  const cachedFormatter = formatters.get(language);
  if (cachedFormatter) {
    return cachedFormatter.format(value);
  }

  const formatter = new Intl.NumberFormat(language);
  formatters.set(language, formatter);

  return formatter.format(value);
};
