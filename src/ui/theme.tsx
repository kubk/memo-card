import { colord } from "colord";

const cssVarToValue = (cssProperty: string) => {
  const cssPropertyClean = cssProperty.replace("var(", "").replace(")", "");
  const result = getComputedStyle(document.documentElement).getPropertyValue(
    cssPropertyClean,
  );
  if (!result) {
    console.warn("Variable " + cssPropertyClean + " is not available");
    return "#00000";
  }
  return result;
};

const secondaryBgColor = "var(--tg-theme-secondary-bg-color)";
const buttonColor = "var(--tg-theme-button-color)";
const buttonTextColor = "var(--tg-theme-button-text-color)";
const bgColor = "var(--tg-theme-bg-color)";
const textColor = "var(--tg-theme-text-color)";
const hintColor = "var(--tg-theme-hint-color)";
const linkColor = "var(--tg-theme-link-color)";

export const theme = {
  bgColor,
  textColor,
  hintColor,
  hintColorComputed: cssVarToValue(hintColor),
  linkColor,
  buttonColor,
  buttonTextColor,
  secondaryBgColor,

  // Needed for framer-motion library
  secondaryBgColorComputed: cssVarToValue(secondaryBgColor),
  buttonColorComputed: cssVarToValue(buttonColor),
  buttonTextColorComputed: cssVarToValue(buttonTextColor),

  success: "#2ecb47",
  successLight: colord("#2ecb47").alpha(0.4).toHex(),
  danger: "#fc2025",
  dangerLight: colord("#fc2025").alpha(0.4).toHex(),
  dividerColor: '#ccc',

  borderRadius: 12,
};
