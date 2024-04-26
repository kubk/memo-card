const executed = new Set<string>();

export const executeOnce = (key: string, fn: () => void) => {
  if (executed.has(key)) {
    return;
  }
  executed.add(key);
  fn();
};
