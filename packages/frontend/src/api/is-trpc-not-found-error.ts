import { isTRPCClientError } from "@trpc/client";
import { type ApiRouter } from "api";

export function isTrpcNotFoundError(error: unknown) {
  return (
    isTRPCClientError<ApiRouter>(error) && error.data?.code === "NOT_FOUND"
  );
}
