import { ApiRouter } from "api";
import {
  createTRPCClient,
  httpLink,
  retryLink,
  loggerLink,
} from "@trpc/client";
import { trimEnd } from "../lib/string/trim";
import { getAuthHeaders } from "./get-auth-headers";
import { env } from "../env";
import { createApiProxy } from "./create-api-proxy.ts";
import { apiUrl } from "../lib/urls/proxy-urls.ts";

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
      url: `${trimEnd(apiUrl, "/")}/`,
      headers: getAuthHeaders,
    }),
  ],
});

export const apiProxy = createApiProxy(api);
