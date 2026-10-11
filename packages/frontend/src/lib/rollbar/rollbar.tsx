export const reportHandledError = (
  description: string,
  e?: any,
  info?: any,
) => {
  console.error(e);
  if (!window.Rollbar) {
    return;
  }
  window.Rollbar.error(description, e, info);
};
