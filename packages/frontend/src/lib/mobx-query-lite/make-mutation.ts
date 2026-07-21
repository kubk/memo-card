import { makeAutoObservable, runInAction } from "mobx";

type MutationResult<TData> =
  | { ok: true; data: TData }
  | { ok: false; error: unknown };

export type MutationState<TArgs extends unknown[], TData> = {
  data: TData | undefined;
  error: unknown | null;
  isPending: boolean;
  mutate: (...args: TArgs) => Promise<TData>;
  mutateResult: (...args: TArgs) => Promise<MutationResult<TData>>;
};

class Mutation<TArgs extends unknown[], TData> implements MutationState<
  TArgs,
  TData
> {
  data: TData | undefined;
  error: unknown | null = null;
  isPending = false;
  private mutationId = 0;

  constructor(private mutationFn: (...args: TArgs) => Promise<TData>) {
    makeAutoObservable<this, "mutationFn" | "mutationId">(
      this,
      {
        mutationFn: false,
        mutationId: false,
      },
      { autoBind: true },
    );
  }

  async mutate(...args: TArgs) {
    const currentMutationId = this.mutationId + 1;
    this.mutationId = currentMutationId;
    this.isPending = true;
    this.error = null;

    try {
      const data = await this.mutationFn(...args);
      runInAction(() => {
        if (this.mutationId !== currentMutationId) {
          return;
        }

        this.data = data;
        this.isPending = false;
      });
      return data;
    } catch (error) {
      runInAction(() => {
        if (this.mutationId !== currentMutationId) {
          return;
        }

        this.error = error;
        this.isPending = false;
      });
      throw error;
    }
  }

  async mutateResult(...args: TArgs): Promise<MutationResult<TData>> {
    try {
      return { ok: true, data: await this.mutate(...args) };
    } catch (error) {
      return { ok: false, error };
    }
  }
}

export function makeMutation<TArgs extends unknown[], TData>(
  mutationFn: (...args: TArgs) => Promise<TData>,
): MutationState<TArgs, TData> {
  return new Mutation(mutationFn);
}
