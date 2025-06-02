import { trimEnd, trimStart } from "../string/trim.ts";
import { platform } from "../platform/platform.ts";
import { collectClientData } from "./collect-client-data.ts";
import { UserHeaders } from "api";
import { screenStore } from "../../store/screen-store.ts";

const baseUrl = import.meta.env.VITE_API_URL || "";

const allowedWithoutAuth = ["/google-signin"];

const allowedToReFetch = [
  "/upsert-deck",
  "/review-cards",
  "/add-card",
  "/add-deck-to-mine",
];

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const encodeHeaderValue = (value: string): string => {
  return btoa(encodeURIComponent(value));
};

const requestInner = async <Output, Input = object>(
  path: `/${string}`,
  method: HttpMethod = "GET",
  body?: Input,
): Promise<Output> => {
  const endpoint = `${trimEnd(baseUrl, "/")}/${trimStart(path, "/")}`;
  const bodyAsString = body ? JSON.stringify(body) : undefined;

  const initData = platform.getInitData();

  console.log("platform", platform);

  if (initData === null) {
    if (screenStore.screen.type !== "browserLogin") {
      screenStore.go({ type: "browserLogin" });
    }
    if (!allowedWithoutAuth.includes(path)) {
      return null as Output;
    }
  }

  const headers: Record<any, any> = {
    [UserHeaders.Hash]: initData ? encodeHeaderValue(initData) : "",
    [UserHeaders.Platform]: encodeHeaderValue(collectClientData()),
    "X-Header-Encoding": "base64",
    "Content-Type": "application/json",
  };

  const response = await fetch(endpoint, {
    method,
    body: bodyAsString,
    headers: headers,
  });
  if (response.status === 200) {
    return response.json().then((data) => {
      return data.result.data as Output;
    });
  }
  if (response.status === 401) {
    screenStore.go({ type: "browserLogin" });
    return null as any;
  }

  throw new Error(
    `Non-successful status: ${
      response.status
    }. Endpoint: ${endpoint}. Request body: ${bodyAsString}. Error: ${await response.text()}`,
  );
};

// Retry GET request once and some POST/PUT requests
export const request = async <Output, Input = object>(
  path: `/${string}`,
  method: HttpMethod = "GET",
  body?: Input,
): Promise<Output> => {
  try {
    return await requestInner(path, method, body);
  } catch (error) {
    if (method === "GET" || allowedToReFetch.includes(path)) {
      return requestInner(path, method, body);
    }
    throw error;
  }
};
