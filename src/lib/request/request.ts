import { trimEnd, trimStart } from "../string/trim.ts";
import { platform } from "../platform/platform.ts";
import { collectClientData } from "./collect-client-data.ts";
import { UserHeaders } from "../../../functions/services/get-telegram-user.ts";
import { BrowserPlatform } from "../platform/browser/browser-platform.ts";
import { screenStore } from "../../store/screen-store.ts";

const baseUrl = import.meta.env.VITE_API_URL || "";

const requestInner = async <Output, Input = object>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: Input,
): Promise<Output> => {
  const endpoint = `${trimEnd(baseUrl, "/")}/${trimStart(path, "/")}`;
  const bodyAsString = body ? JSON.stringify(body) : undefined;

  const initData = platform.getInitData();

  if (initData === null) {
    if (screenStore.screen.type !== "tgLoginWidget") {
      screenStore.go({ type: "tgLoginWidget" });
    }
    return null as Output;
  }

  const headers: Record<any, any> = {
    [UserHeaders.Hash]: initData,
    [UserHeaders.Platform]: collectClientData(),
  };
  if (platform instanceof BrowserPlatform && !import.meta.env.VITE_USER_QUERY) {
    headers[UserHeaders.TelegramLogin] = "1";
  }

  const response = await fetch(endpoint, {
    method,
    body: bodyAsString,
    headers: headers,
  });
  if (response.status === 200) {
    return response.json() as Output;
  }
  if (response.status === 401 && endpoint === "/my-info") {
    return null as Output;
  }

  throw new Error(
    `Non-successful status: ${
      response.status
    }. Endpoint: ${endpoint}. Request body: ${bodyAsString}. Error: ${await response.text()}`,
  );
};

// Retry GET request once
export const request = async <Output, Input = object>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: Input,
): Promise<Output> => {
  try {
    return await requestInner(path, method, body);
  } catch (error) {
    if (
      method === "GET" ||
      path === "/upsert-deck" ||
      path === "/review-cards"
    ) {
      return requestInner(path, method, body);
    }
    throw error;
  }
};
