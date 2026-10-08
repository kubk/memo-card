import { useLayoutEffect } from "preact/compat";

export const useMount = (cb: () => void) => {
  useLayoutEffect(() => {
    return cb();
    // eslint-disable-next-line
  }, []);
};
