import { createJsonResponse } from "./create-json-response.ts";

export const createBadRequestResponse = (message?: string) => {
  return createJsonResponse<{ message: string }>(
    { message: `Bad request. ${message}` },
    400,
  );
};
