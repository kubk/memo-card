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

const allowedToReFetch = [
  "cardsReview",
  "deckUpsert",
  "card.add",
  "card.addMultiple",
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

        const shouldRetry =
          opts.op.type === "query" || allowedToReFetch.includes(opts.op.path);

        if (!shouldRetry) {
          return false;
        }

        return opts.attempts <= 4;
      },
      retryDelayMs: (attemptIndex) => attemptIndex * 1000,
    }),
    loggerLink({
      enabled: () => env.VITE_STAGE === "staging",
    }),
    httpLink({
      url: `${trimEnd(env.VITE_API_URL, "/")}/`,
      headers: getAuthHeaders,
    }),
  ],
});
