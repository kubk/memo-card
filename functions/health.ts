import { createJsonResponse } from "./lib/json-response/create-json-response.ts";

export type HealthResponse = { status: "ok" };

// An endpoint to check if API is up and running
export const onRequest: PagesFunction = () => {
  return createJsonResponse<HealthResponse>({ status: "ok" });
};
