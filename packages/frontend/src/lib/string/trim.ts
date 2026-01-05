export const trimEnd = (str: string, sub: string) => {
  if (str.endsWith(sub)) {
    return str.slice(0, -sub.length);
  }
  return str;
};
