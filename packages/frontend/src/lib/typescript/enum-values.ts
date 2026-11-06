type EnumLike = Record<string, string | number>;

export function enumValues<E extends EnumLike>(enumObject: E): E[keyof E][] {
  return Object.keys(enumObject)
    .filter((key) => Number.isNaN(Number(key)))
    .map((key) => enumObject[key] as E[keyof E]);
}

export function enumEntries<E extends EnumLike>(
  enumObject: E,
): [keyof E, E[keyof E]][] {
  return Object.entries(enumObject) as [keyof E, E[keyof E]][];
}
