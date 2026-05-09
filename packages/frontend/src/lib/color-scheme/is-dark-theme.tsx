const darkThemeMediaQuery = "(prefers-color-scheme: dark)";

export const isDarkTheme = () => {
  return window.matchMedia(darkThemeMediaQuery).matches;
};

export const listenDarkThemeChange = (onChange: () => void) => {
  if (!window.matchMedia) {
    return;
  }

  window.matchMedia(darkThemeMediaQuery).addEventListener("change", onChange);
};
