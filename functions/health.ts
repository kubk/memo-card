import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { handleError } from "./lib/handle-error/handle-error.ts";

export type HealthResponse = { status: "ok" };

// An endpoint to check if API is up and running
export const onRequest = handleError(async () => {
  return createJsonResponse<HealthResponse>({ status: "ok" });
});
