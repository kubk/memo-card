export type FieldWithValue<T> = {
  value: T;
};

export const isFieldWithValue = (
  object: unknown,
): object is FieldWithValue<unknown> => {
  return typeof object === "object" && object !== null && "value" in object;
};
