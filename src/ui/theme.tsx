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

export const theme = {
  bgColor: "var(--tg-theme-bg-color)",
  textColor: "var(--tg-theme-text-color)",
  hintColor: "var(--tg-theme-hint-color)",
  linkColor: "var(--tg-theme-link-color)",
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

  borderRadius: 8,
};
