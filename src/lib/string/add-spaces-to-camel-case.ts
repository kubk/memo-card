export const addSpacesToCamelCase = (str: string): string => {
  if (str === "UKEnglish") {
    return "UK English";
  }
  if (str === "USEnglish") {
    return "US English";
  }
  return str.replace(/([A-Z])/g, " $1").trim();
};
