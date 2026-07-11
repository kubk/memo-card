type AppendPath<TPath extends string, TKey extends string> = TPath extends ""
  ? TKey
  : `${TPath}.${TKey}`;

type ApiQueryConfig<TKey extends string, TData> = {
  key: TKey;
  query: () => Promise<TData>;
};

type ApiQueryFactory<
  TValue extends (...args: any[]) => Promise<unknown>,
  TPath extends string,
> = [Parameters<TValue>[0]] extends [void]
  ? () => ApiQueryConfig<TPath, Awaited<ReturnType<TValue>>>
  : (
      ...args: Parameters<TValue>
    ) => ApiQueryConfig<string, Awaited<ReturnType<TValue>>>;

type ApiProxyKey<TKey, TValue> = TKey extends string
  ? TValue extends (...args: infer _TArgs) => Promise<unknown>
    ? TKey extends "query"
      ? TKey
      : never
    : TValue extends object
      ? TKey
      : never
  : never;

type ApiProxyValue<
  TValue,
  TKey extends string,
  TPath extends string,
> = TValue extends (...args: infer _TArgs) => Promise<unknown>
  ? TKey extends "query"
    ? ApiQueryFactory<TValue, TPath>
    : never
  : TValue extends object
    ? ApiProxy<TValue, AppendPath<TPath, TKey>>
    : never;

export type ApiProxy<TApi, TPath extends string = ""> = {
  [TKey in keyof TApi as ApiProxyKey<TKey, TApi[TKey]>]: TKey extends string
    ? ApiProxyValue<TApi[TKey], TKey, TPath>
    : never;
};

const getValueAtPath = (value: unknown, path: ReadonlyArray<string>) => {
  return path.reduce<unknown>((currentValue, key) => {
    if (
      currentValue === null ||
      (typeof currentValue !== "object" && typeof currentValue !== "function")
    ) {
      throw new Error(`Could not resolve API path: ${path.join(".")}`);
    }

    return Reflect.get(currentValue, key);
  }, value);
};

const sortObjectKeys = (_key: string, value: unknown) => {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return value;
  }

  return Object.keys(value as Record<string, unknown>)
    .sort()
    .reduce<Record<string, unknown>>((result, key) => {
      result[key] = Reflect.get(value as object, key);
      return result;
    }, {});
};

const createQueryKey = (path: string, input: unknown) => {
  const serializedInput = JSON.stringify(input, sortObjectKeys);
  return serializedInput === undefined ? path : `${path}:${serializedInput}`;
};

export const createApiProxy = <TApi extends object>(api: TApi) => {
  const proxies = new Map<string, unknown>();

  const createProxy = (path: ReadonlyArray<string>): unknown => {
    const cacheKey = JSON.stringify(path);
    const existing = proxies.get(cacheKey);
    if (existing) {
      return existing;
    }

    const proxy = new Proxy(() => undefined, {
      get(_target, key) {
        if (typeof key !== "string" || key === "then") {
          return undefined;
        }

        return createProxy([...path, key]);
      },
      apply(_target, _thisArg, args: Array<unknown>) {
        if (path.at(-1) !== "query") {
          throw new Error(
            `API proxy path must end with query: ${path.join(".")}`,
          );
        }

        const query = getValueAtPath(api, path);
        if (typeof query !== "function") {
          throw new Error(`API query is not callable: ${path.join(".")}`);
        }

        const procedurePath = path.slice(0, -1).join(".");

        if (args.length === 0) {
          return {
            key: procedurePath,
            query,
          };
        }

        return {
          key: createQueryKey(procedurePath, args[0]),
          query: () => Reflect.apply(query, undefined, args),
        };
      },
    });

    proxies.set(cacheKey, proxy);
    return proxy;
  };

  return createProxy([]) as ApiProxy<TApi>;
};
