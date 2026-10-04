export const random = <T>(arr: readonly T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
