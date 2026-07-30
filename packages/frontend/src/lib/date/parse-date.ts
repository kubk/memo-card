import { isValid, parseISO } from "date-fns";

export const parseDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const date = parseISO(value);
  return isValid(date) ? date : null;
};
