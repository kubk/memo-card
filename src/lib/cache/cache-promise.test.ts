import { test, vi, expect } from "vitest";
import { cachePromise } from "./cache-promise.ts";

test("should cache the resolved value of a promise", async () => {
  const mockFunction = vi.fn();
  mockFunction.mockResolvedValueOnce("Cached value");

  const promise = new Promise<string>((resolve) => {
    resolve(mockFunction());
  });

  const cached = cachePromise<string>();

  // First call, should invoke the promise
  const result1 = await cached(promise);
  expect(result1).toBe("Cached value");
  expect(mockFunction).toHaveBeenCalledTimes(1);

  // Second call, should use cached value
  const result2 = await cached(promise);
  expect(result2).toBe("Cached value");
  // The mock function should not have been called again
  expect(mockFunction).toHaveBeenCalledTimes(1);
});
