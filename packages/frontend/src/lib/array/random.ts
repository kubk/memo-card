export const random = <T>(arr: Array<T>): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
