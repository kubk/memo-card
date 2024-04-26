import { executeOnce } from "./execute-once.ts";
import { expect, test, vi } from "vitest";

test("execute once", () => {
  const fn1 = vi.fn();
  const fn2 = vi.fn();
  const fn3 = vi.fn();

  executeOnce("id", fn1);
  executeOnce("id", fn1);
  executeOnce("id", fn1);
  executeOnce("second", fn2);
  executeOnce("third", fn3);

  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledTimes(1);
  expect(fn3).toHaveBeenCalledTimes(1);
});
