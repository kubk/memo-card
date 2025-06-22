import { stringToDate } from "api";
import { DateTime } from "luxon";

export const formatPaidUntil = (paidUntil: string) => {
  if (!paidUntil) {
    return null;
  }

  const date = stringToDate(paidUntil);

  if (!date) {
    return null;
  }

  return date.toLocaleString(DateTime.DATE_FULL);
};
