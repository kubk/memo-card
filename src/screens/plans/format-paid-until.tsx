export const formatPaidUntil = (paidUntil: string) => {
  if (!paidUntil) {
    return null;
  }

  const date = new Date(paidUntil);
  if (isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
