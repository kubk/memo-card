import { isNetworkError } from "../../api/is-network-error.ts";

export const reportHandledError = (
  description: string,
  e?: any,
  info?: any,
) => {
  console.error(e);
  if (!window.Rollbar || isNetworkError(e)) {
    return;
  }
  window.Rollbar.error(description, e, info);
};
