import { createJsonResponse } from "./create-json-response.ts";

export const createAuthFailedResponse = () => {
  return createJsonResponse<{ message: string }>(
    { message: "Telegram auth didnt pass" },
    401,
  );
};
