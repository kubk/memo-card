import { RequestStore } from "./requestStore.ts";
import { expect, test } from "vitest";
import { when } from "mobx";

test("request - success", async () => {
  const sum = (a: number, b: number) => Promise.resolve(a + b);
  const request = new RequestStore(sum);

  expect(request.result).toEqual({ data: null, status: "idle" });
  request.execute(1, 2);
  await when(() => request.result.status === "success");
  expect(request.result).toEqual({ data: 3, status: "success" });
});
