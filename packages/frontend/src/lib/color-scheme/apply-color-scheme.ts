export type ColorScheme = "dark" | "light";

export const applyColorScheme = (colorScheme: ColorScheme) => {
  document.documentElement.classList.toggle("dark", colorScheme === "dark");
  document.documentElement.style.colorScheme = colorScheme;
};
