import { describe, expect, it, vi } from "vitest";
import { makeMutation } from "./make-mutation.ts";

describe("makeMutation", () => {
  it("returns successful data from mutateResult", async () => {
    const mutation = makeMutation(async (value: number) => value * 2);

    const result = await mutation.mutateResult(2);

    expect(result).toEqual({ ok: true, data: 4 });
    expect(mutation.data).toBe(4);
    expect(mutation.error).toBe(null);
    expect(mutation.isPending).toBe(false);
  });

  it("returns errors from mutateResult without throwing", async () => {
    const error = new Error("Mutation failed");
    const mutation = makeMutation(async () => {
      throw error;
    });

    const result = await mutation.mutateResult();

    expect(result).toEqual({ ok: false, error });
    expect(mutation.data).toBe(undefined);
    expect(mutation.error).toBe(error);
    expect(mutation.isPending).toBe(false);
  });

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
