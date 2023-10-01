import { ZodType } from "zod";

export const createJsonResponse = <T>(
  schema: ZodType<T>,
  data: T,
  status = 200,
) => {
  const result = schema.parse(data);

  return new Response(JSON.stringify(result), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "content-type": "application/json",
    },
    status: status,
  });
};
