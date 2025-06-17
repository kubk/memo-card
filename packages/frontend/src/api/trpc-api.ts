import { ApiRouter } from "api";
import { createTRPCClient, httpLink, retryLink } from "@trpc/client";
import { trimEnd } from "../lib/string/trim";
import { getAuthHeaders } from "./get-auth-headers";
import { envSafe } from "../envSafe";

const allowedToReFetch = [
  "upsert-deck",
  "review-cards",
  "add-card",
  "add-deck-to-mine",
  "user-settings",
];

export const api = createTRPCClient<ApiRouter>({
  links: [
    retryLink({
      retry(opts) {
        const shouldRetry =
          opts.op.type === "query" || allowedToReFetch.includes(opts.op.path);

        if (!shouldRetry) {
          return false;
        }

        return opts.attempts <= 4;
      },
      retryDelayMs: (attemptIndex) => attemptIndex * 1000,
    }),
    httpLink({
      url: `${trimEnd(envSafe.apiBaseUrl, "/")}/`,
      headers: getAuthHeaders,
    }),
  ],
});
