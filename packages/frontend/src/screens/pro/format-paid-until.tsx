import { DateTime } from "luxon";

export const formatPaidUntil = (paidUntil: string) => {
  if (!paidUntil) {
    return null;
  }

  const date = DateTime.fromISO(paidUntil);

  if (!date.isValid) {
    return null;
  }

  return date.toLocaleString(DateTime.DATE_FULL);
};
