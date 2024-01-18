export type ClonableField<T> = {
  clone: () => T;
};
