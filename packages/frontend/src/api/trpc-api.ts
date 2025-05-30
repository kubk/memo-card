import { ApiRouter } from "api";
import { createTRPCClient, httpLink } from "@trpc/client";
import { trimEnd } from "../lib/string/trim";

const baseUrl = import.meta.env.VITE_API_URL || "";

export const api = createTRPCClient<ApiRouter>({
  links: [
    httpLink({
      url: `${trimEnd(baseUrl, "/")}/`,
      //   headers: getAuthHeaders,
    }),
  ],
});
