import { parseDate } from "../../lib/date/parse-date.ts";

export const formatPaidUntil = (paidUntil: string) => {
  if (!paidUntil) {
    return null;
  }

  const date = parseDate(paidUntil);

  if (!date) {
    return null;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
