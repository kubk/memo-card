export const formatPaidUntil = (paidUntil: string) => {
  if (!paidUntil) {
    return null;
  }

  const date = new Date(paidUntil);
  if (isNaN(date.getTime())) {
    return null;
  }

  const locale = navigator.language || "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
