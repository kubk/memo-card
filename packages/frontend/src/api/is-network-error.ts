const networkErrorMessages = [
  "Failed to fetch",
  "Load failed",
  "NetworkError when attempting to fetch resource.",
  "Network request failed",
];

export function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  if (
    error instanceof TypeError &&
    networkErrorMessages.includes(error.message)
  ) {
    return true;
  }

  return (
    ("cause" in error && isNetworkError(error.cause)) ||
    ("e" in error && isNetworkError(error.e))
  );
}
