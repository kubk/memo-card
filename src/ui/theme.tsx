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

const buttonColorComputed = cssVarToValue(buttonColor);

export const theme = {
  bgColor,
  textColor,
  hintColor,
  hintColorComputed: cssVarToValue(hintColor),
  linkColor,
  buttonColor,
  buttonTextColor,
  secondaryBgColor,

  buttonColorComputed: buttonColorComputed,
  buttonColorLighter: colord(buttonColorComputed).lighten(0.4).toHex(),
  buttonTextColorComputed: cssVarToValue(buttonTextColor),

  success: "#2ecb47",
  successLight: colord("#2ecb47").alpha(0.4).toHex(),
  danger: "#fc2025",
  orange: "#FF9F0A",
  dangerLight: colord("#fc2025").alpha(0.4).toHex(),
  divider: "rgba(0, 0, 0, .05)",

  icons: {
    pink: "#c72ab9",
    violet: "#5454d6",
    blue: "#0e77f1",
    turquoise: "#16a6c3",
    sea: "#1abe8a",
    green: "#1edb59",
  },

  borderRadius: 12,
  boxShadow: "0 0 8px rgba(56, 0, 107, 0.16)",
};
