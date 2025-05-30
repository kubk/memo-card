export const cssVarToValue = (cssProperty: string) => {
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
