import { useEffect } from "react";

export const useMount = (cb: () => void) => {
  useEffect(() => {
    return cb();
    // eslint-disable-next-line
  }, []);
};
