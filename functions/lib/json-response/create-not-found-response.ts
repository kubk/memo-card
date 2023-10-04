import { createJsonResponse } from "./create-json-response.ts";

export const createNotFoundResponse = () => {
  return createJsonResponse<{ message: string }>({ message: `Not found` }, 404);
};
