export const getLocalTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;
