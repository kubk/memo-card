import { RequestStore } from "./request-store.ts";
import { expect, test, vi } from "vitest";
import { when } from "mobx";

test("request - success", async () => {
  const sum = (a: number, b: number) => Promise.resolve(a + b);
  const request = new RequestStore(sum);

  expect(request.result).toEqual({ data: null, status: "idle" });
  request.execute(1, 2);
  await when(() => request.result.status === "success");
  expect(request.result).toEqual({ data: 3, status: "success" });
});

test("request - cache", async () => {
  const fn1 = vi.fn();
  const request = new RequestStore(fn1, { cacheId: "cache" });
  request.execute();
  await when(() => request.result.status === "success");
  expect(fn1).toBeCalledTimes(1);

  request.execute();
  await when(() => request.result.status === "success");
  expect(fn1).toBeCalledTimes(1);

  const fn2 = vi.fn();
  const request2 = new RequestStore(fn2);
  request2.execute();
  await when(() => request2.result.status === "success");
  expect(fn2).toBeCalledTimes(1);

  request2.execute();
  await when(() => request2.result.status === "success");
  expect(fn2).toBeCalledTimes(2);
});

test("request - loading - default", async () => {
  const fn = () => new Promise((resolve) => setTimeout(resolve, 300));
  const request = new RequestStore(fn);
  request.execute();
  expect(request.result.status).toBe("loading");
  await when(() => request.result.status === "success");
  request.execute();
  expect(request.result.status).toBe("loading");
});

test("request - loading - swr", async () => {
  const fn = () => new Promise((resolve) => setTimeout(resolve, 300));
  const request = new RequestStore(fn, { staleWhileRevalidate: true });
  request.execute();
  expect(request.result.status).toBe("loading");
  await when(() => request.result.status === "success");
  request.execute();
  expect(request.result.status).toBe("success");
});
