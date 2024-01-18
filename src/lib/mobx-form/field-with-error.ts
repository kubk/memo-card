export type FieldWithError = {
  error?: string;
};

export const isFieldWithError = (field: unknown): field is FieldWithError => {
  return typeof field === "object" && field !== null && "error" in field;
};
