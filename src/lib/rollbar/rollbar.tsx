export const reportHandledError = (
  description: string,
  e?: any,
  info?: any,
) => {
  console.error(e);
  if (!("Rollbar" in window)) {
    return;
  }
  // @ts-ignore
  Rollbar.error(description, e, info);
};
