import { type ApiRouter, appApiPath } from "api";
import {
  createTRPCClient,
  httpLink,
  retryLink,
  loggerLink,
} from "@trpc/client";
import { getAuthHeaders } from "./get-auth-headers";
import { env } from "../env";
import { createApiProxy } from "./create-api-proxy.ts";

const idempotentMutations = [
  "cardsReview",
  "card.update",
  "deck.update",
  "userSettings",
];

export const api = createTRPCClient<ApiRouter>({
  links: [
    retryLink({
      retry(opts) {
        if (env.VITE_STAGE === "local") {
          return false;
        }

        if (
          opts.op.path === "me.info" &&
          opts.error.data?.code === "UNAUTHORIZED"
        ) {
          return false;
        }

        if (opts.error.data?.code === "NOT_FOUND") {
          return false;
        }

        const shouldRetry =
          opts.op.type === "query" ||
          idempotentMutations.includes(opts.op.path);

        if (!shouldRetry) {
          return false;
        }

        return opts.attempts <= 4;
      },
      retryDelayMs: (attemptIndex) => attemptIndex * 1000,
    }),
    loggerLink({
      enabled: (opts) =>
        env.VITE_STAGE === "staging" &&
        !("path" in opts && opts.path === "telegramSignin"),
    }),
    httpLink({
      url: `${appApiPath}/`,
      headers: getAuthHeaders,
      // The Google TTS player sets the page to no-referrer, and the API checks the referer
      fetch: (input, init) =>
        fetch(input, { ...init, referrerPolicy: "same-origin" }),
    }),
  ],
});

export const apiProxy = createApiProxy(api);
