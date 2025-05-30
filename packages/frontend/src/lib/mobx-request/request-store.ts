import { makeAutoObservable, runInAction } from "mobx";

type SuccessResult<T> = { data: T; status: "success" };
type ErrorResult = { data: null; status: "error"; error: any };
type LoadingResult = { data: null; status: "loading" };
type IdleResult = { data: null; status: "idle" };

type Result<T> = SuccessResult<T> | ErrorResult | LoadingResult | IdleResult;
type ExecuteResult<T> = SuccessResult<T> | ErrorResult;

type Options = {
  cacheId?: string;
  staleWhileRevalidate?: boolean;
};

const cacheStorage = new Map<string, any>();

export class RequestStore<T, Args extends any[] = []> {
  result: Result<T> = { data: null, status: "idle" };

  constructor(
    private fetchFn: (...args: Args) => Promise<T>,
    public readonly options?: Options,
  ) {
    makeAutoObservable<this, "fetchFn">(
      this,
      { fetchFn: false },
      { autoBind: true },
    );
  }

  execute = async (...args: Args): Promise<ExecuteResult<T>> => {
    if (this.options?.cacheId && cacheStorage.has(this.options.cacheId)) {
      this.result = {
        data: cacheStorage.get(this.options.cacheId),
        status: "success",
      };
      return this.result as unknown as ExecuteResult<T>;
    }

    if (
      !this.options?.staleWhileRevalidate ||
      this.result.status !== "success"
    ) {
      this.result = { data: null, status: "loading" };
    }

    try {
      const data = await this.fetchFn(...args);
      runInAction(() => {
        this.result = { data, status: "success" };
        if (this.options?.cacheId) {
          cacheStorage.set(this.options.cacheId, data);
        }
      });
    } catch (error) {
      runInAction(() => {
        this.result = { data: null, status: "error", error };
      });
    }

    return this.result as unknown as ExecuteResult<T>;
  };

  // Non type-safe shorthand
  get isLoading() {
    return this.result.status === "loading";
  }

  // Non type-safe shorthand
  get isSuccess() {
    return this.result.status === "success";
  }
}
