export const reportHandledError = (
  description: string,
  e?: any,
  info?: any,
) => {
  console.error(e);
  // @ts-ignore
  Rollbar.error(description, e, info);
};
