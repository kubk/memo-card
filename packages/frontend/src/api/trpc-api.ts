import { ApiRouter } from "api";
import { createTRPCClient, httpLink, retryLink } from "@trpc/client";
import { trimEnd } from "../lib/string/trim";
import { getAuthHeaders } from "./request";

const baseUrl = import.meta.env.VITE_API_URL || "";

export const api = createTRPCClient<ApiRouter>({
  links: [
    retryLink({
      retry(opts) {
        // Only GET for now
        if (opts.op.type !== "query") {
          return false;
        }
        return opts.attempts <= 4;
      },
      // No delay for first attempt, then 1s, then 2s
      retryDelayMs: (attemptIndex) => attemptIndex * 1000,
    }),
    httpLink({
      url: `${trimEnd(baseUrl, "/")}/`,
      headers: getAuthHeaders,
    }),
  ],
});
