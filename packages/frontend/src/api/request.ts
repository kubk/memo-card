import { trimEnd, trimStart } from "../lib/string/trim.ts";
import { platform } from "../lib/platform/platform.ts";
import { collectClientData } from "./collect-client-data.ts";
import { UserHeaders } from "api";
import { screenStore } from "../store/screen-store.ts";

const baseUrl = import.meta.env.VITE_API_URL || "";

const allowedWithoutAuth = ["/google-signin"];

const allowedToReFetch = [
  "/upsert-deck",
  "/review-cards",
  "/add-card",
  "/add-deck-to-mine",
  "/user-settings",
];

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export function getAuthHeaders() {
  const initData = platform.getInitData();

  return {
    [UserHeaders.Hash]: initData ? initData : "",
    [UserHeaders.Platform]: collectClientData(),
    "Content-Type": "application/json",
  };
}

const requestInner = async <Output, Input = object>(
  path: `/${string}`,
  method: HttpMethod = "GET",
  body?: Input,
): Promise<Output> => {
  const endpoint = `${trimEnd(baseUrl, "/")}/${trimStart(path, "/")}`;
  const bodyAsString = body ? JSON.stringify(body) : undefined;

  const initData = platform.getInitData();

  if (initData === null) {
    if (screenStore.screen.type !== "browserLogin") {
      screenStore.go({ type: "browserLogin" });
    }
    if (!allowedWithoutAuth.includes(path)) {
      return null as Output;
    }
  }

  const headers = getAuthHeaders();

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

const MAX_RETRIES = 3;

export const request = async <Output, Input = object>(
  path: `/${string}`,
  method: HttpMethod = "GET",
  body?: Input,
  retryCount = 0,
): Promise<Output> => {
  try {
    return await requestInner(path, method, body);
  } catch (error) {
    if (
      (method === "GET" || allowedToReFetch.includes(path)) &&
      retryCount < MAX_RETRIES
    ) {
      console.log(
        `Retrying request to ${path} (attempt ${
          retryCount + 1
        } of ${MAX_RETRIES})`,
      );
      return request(path, method, body, retryCount + 1);
    }
    throw error;
  }
};
