export const trimStart = (str: string, sub: string) => {
  if (str.startsWith(sub)) {
    return str.slice(sub.length);
  }
  return str;
};

export const trimEnd = (str: string, sub: string) => {
  if (str.endsWith(sub)) {
    return str.slice(0, -sub.length);
  }
  return str;
};
