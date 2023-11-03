import { trimEnd, trimStart } from "../string/trim.ts";
import WebApp from "@twa-dev/sdk";

const baseUrl = import.meta.env.VITE_API_URL || "";

export const request = async <Output, Input = object>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: Input,
): Promise<Output> => {
  const endpoint = `${trimEnd(baseUrl, "/")}/${trimStart(path, "/")}`;
  const bodyAsString = body ? JSON.stringify(body) : undefined;

  const response = await fetch(endpoint, {
    method,
    body: bodyAsString,
    headers: {
      hash: WebApp.initData,
    },
  });
  if (response.status === 200) {
    return response.json() as Output;
  }
  throw new Error(
    `Non-successful status: ${
      response.status
    }. Endpoint: ${endpoint}. Request body: ${bodyAsString}. Error: ${await response.text()}`,
  );
};
