import { useEffect, useRef } from "react";

export const useIsOverflowing = (
  key: boolean,
  setIsOverflowing: (is: boolean) => void,
) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const current = ref.current;
    if (current) {
      const isContentOverflowing = current.scrollHeight > current.clientHeight;
      setIsOverflowing(isContentOverflowing);
    }
  }, [setIsOverflowing, ref, key]);

  return { setIsOverflowing, ref };
};
