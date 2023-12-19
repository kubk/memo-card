export const parseDeckFromText = (
  text: string,
): {
  front: string;
  back: string;
} | null => {
  const [front, back] = text.split(" - ");
  if (!front || !back) {
    return null;
  }
  return { front, back };
};
