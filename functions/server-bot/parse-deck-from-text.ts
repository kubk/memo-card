const separator = " - ";

export const parseDeckFromText = (
  text: string,
): {
  front: string;
  back: string;
} | null => {
  if (!text.includes(separator)) {
    return {
      front: text,
      back: text,
    };
  }

  const [front, back] = text.split(separator);
  if (!front || !back) {
    return null;
  }
  return { front, back };
};
