export const camelCaseToHuman = (str: string) => {
  return str.replace(/([A-Z])/g, " $1");
};
