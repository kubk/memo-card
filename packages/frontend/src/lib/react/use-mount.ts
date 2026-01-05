import { useLayoutEffect } from "react";

export const useMount = (cb: () => void) => {
  useLayoutEffect(() => {
    return cb();
    // eslint-disable-next-line
  }, []);
};
