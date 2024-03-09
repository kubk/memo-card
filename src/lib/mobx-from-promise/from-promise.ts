// Copied from mobx-utils because it doesn't support tree shaking
/* eslint-disable */
import { action, extendObservable } from "mobx";
import { assert } from "../typescript/assert";

export const PENDING = "pending";
export const FULFILLED = "fulfilled";
export const REJECTED = "rejected";

type CaseHandlers<U, T> = {
  pending?: (t?: T) => U;
  fulfilled?: (t: T) => U;
  rejected?: (e: any) => U;
};

export interface IBasePromiseBasedObservable<T> extends PromiseLike<T> {
  isPromiseBasedObservable: true;
  case<U>(handlers: CaseHandlers<U, T>, defaultFulfilled?: boolean): U;
}

export type IPendingPromise<T> = {
  readonly state: "pending";
  readonly value: T | undefined;
};

export type IFulfilledPromise<T> = {
  readonly state: "fulfilled";
  readonly value: T;
};

export type IRejectedPromise = {
  readonly state: "rejected";
  readonly value: unknown;
};

export type IPromiseBasedObservable<T> = IBasePromiseBasedObservable<T> &
  (IPendingPromise<T> | IFulfilledPromise<T> | IRejectedPromise);

function caseImpl<U, T>(
  this: IPromiseBasedObservable<T>,
  handlers: CaseHandlers<U, T>,
): U | T | undefined {
  switch (this.state) {
    case PENDING:
      return handlers.pending && handlers.pending(this.value);
    case REJECTED:
      return handlers.rejected && handlers.rejected(this.value);
    case FULFILLED:
      return handlers.fulfilled ? handlers.fulfilled(this.value) : this.value;
  }
}

export function fromPromise<T>(
  origPromise: PromiseLike<T>,
  oldPromise?: IPromiseBasedObservable<T>,
): IPromiseBasedObservable<T> {
  assert(arguments.length <= 2, "fromPromise expects up to two arguments");
  assert(
    typeof origPromise === "function" ||
      (typeof origPromise === "object" &&
        origPromise &&
        typeof origPromise.then === "function"),
    "Please pass a promise or function to fromPromise",
  );
  if ((origPromise as any).isPromiseBasedObservable === true)
    return origPromise as any;

  if (typeof origPromise === "function") {
    // If it is a (reject, resolve function, wrap it)
    origPromise = new Promise(origPromise as any);
  }

  const promise = origPromise as any;
  origPromise.then(
    action("observableFromPromise-resolve", (value: any) => {
      promise.value = value;
      promise.state = FULFILLED;
    }),
    action("observableFromPromise-reject", (reason: any) => {
      promise.value = reason;
      promise.state = REJECTED;
    }),
  );

  promise.isPromiseBasedObservable = true;
  promise.case = caseImpl;
  const oldData =
    oldPromise &&
    (oldPromise.state === FULFILLED || oldPromise.state === PENDING)
      ? oldPromise.value
      : undefined;
  extendObservable(
    promise,
    {
      value: oldData,
      state: PENDING,
    },
    {},
    { deep: false },
  );

  return promise;
}
export namespace fromPromise {
  export const reject = action("fromPromise.reject", function <
    T,
  >(reason: any): IRejectedPromise & IBasePromiseBasedObservable<T> {
    const p: any = fromPromise(Promise.reject(reason));
    p.state = REJECTED;
    p.value = reason;
    return p;
  });

  function resolveBase<T>(
    value: T,
  ): IFulfilledPromise<T> & IBasePromiseBasedObservable<T>;
  function resolveBase<T>(
    value?: T,
  ): IFulfilledPromise<T | undefined> & IBasePromiseBasedObservable<T>;
  function resolveBase<T>(
    value: T | undefined = undefined,
  ): IFulfilledPromise<T | undefined> &
    IBasePromiseBasedObservable<T | undefined> {
    const p: any = fromPromise(Promise.resolve(value));
    p.state = FULFILLED;
    p.value = value;
    return p;
  }

  export const resolve = action("fromPromise.resolve", resolveBase);
}
