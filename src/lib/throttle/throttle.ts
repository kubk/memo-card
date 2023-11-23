// @ts-nocheck

export function throttle(func, limit) {
  let inThrottle;
  return function() {
    // eslint-disable-next-line
    const args = arguments;
    // eslint-disable-next-line
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
