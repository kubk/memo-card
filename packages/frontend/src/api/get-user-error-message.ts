import { isTRPCClientError } from "@trpc/client";
import { type ApiRouter } from "api";

export function getUserErrorMessage(error: unknown) {
  if (
    isTRPCClientError<ApiRouter>(error) &&
    error.data &&
    "userMessage" in error.data
  ) {
    return error.data.userMessage;
  }

  return null;
}
