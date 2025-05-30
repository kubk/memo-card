export const arrayDifference = <T>(a: T[], b: T[]): T[] => {
  return a.filter((value) => !b.includes(value));
};
