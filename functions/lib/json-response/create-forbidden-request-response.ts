import { createJsonResponse } from "./create-json-response.ts";

export const createForbiddenRequestResponse = (message?: string) => {
  return createJsonResponse<{ message: string }>(
    { message: `Forbidden. ${message}` },
    403,
  );
};
