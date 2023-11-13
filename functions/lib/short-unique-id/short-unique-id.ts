import ShortUniqueId from "short-unique-id";

export const shortUniqueId = () => {
  return new ShortUniqueId({ length: 10 }).rnd();
};
