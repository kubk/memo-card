export const isDarkTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
