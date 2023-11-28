import { enumValues } from "./enum-values.ts";

export type EnumLike = { [key: string]: number | string };

export function isEnumValid<T extends EnumLike>(
  param: unknown,
  enumObject: T,
): param is T[keyof T] {
  return enumValues(enumObject).includes(param as T[keyof T]);
}
