import { describe, expect, it, vi } from "vitest";
import { makeMutation } from "./make-mutation.ts";

describe("makeMutation", () => {
  it("ignores older mutation results after a newer mutation starts", async () => {
    let resolveFirst!: (data: string) => void;
    let resolveSecond!: (data: string) => void;
    const mutationFn = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveSecond = resolve;
          }),
      );
    const mutation = makeMutation(mutationFn);

    const firstMutation = mutation.mutate("first");
    const secondMutation = mutation.mutate("second");

    resolveFirst("first");
    await firstMutation;

    expect(mutation.data).toBe(undefined);
    expect(mutation.isPending).toBe(true);

    resolveSecond("second");
    await secondMutation;

    expect(mutation.data).toBe("second");
    expect(mutation.isPending).toBe(false);
  });
});
