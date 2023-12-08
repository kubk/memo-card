export const reportHandledError = (
  description: string,
  e?: any,
  info?: any,
) => {
  console.error(e);
  // @ts-ignore
  Rollbar.error(description, e, info);
};

let reported = false;

export const reportHandledErrorOnce = (
  description: string,
  e?: any,
  info?: any,
) => {
  if (reported) {
    return;
  }
  reported = true;
  console.error(e);
  // @ts-ignore
  Rollbar.error(description, e, info);
};
