export const cachePromise = <T>() => {
  let cache: T | null = null;
  let isCacheSet = false;

  return async function (promise: Promise<T>): Promise<T> {
    if (isCacheSet) {
      return cache as T;
    }

    cache = await promise;
    isCacheSet = true;
    return cache;
  };
};
