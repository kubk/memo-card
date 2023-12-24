import { TextField } from "./text-field.ts";
import { BooleanField } from "./boolean-field.ts";

type Form = Record<string, unknown>;

const walkAndCheck = (
  check: (field: TextField<unknown> | BooleanField) => boolean,
  iterateArray: "some" | "every",
  defaultValue = false,
) => {
  return (form: Form) => {
    return Object.values(form)[iterateArray]((value) => {
      if (value instanceof TextField || value instanceof BooleanField) {
        return check(value);
      }
      if (Array.isArray(value)) {
        return value[iterateArray](check);
      }
      if (typeof value === "object" && value !== null) {
        return Object.values(value)[iterateArray](
          walkAndCheck(check, iterateArray, defaultValue),
        );
      }
      return defaultValue;
    });
  };
};

export const isFormTouchedAndHasError = walkAndCheck(
  (field) => field.isTouched && !!field.error,
  "some",
);

export const isFormTouched = walkAndCheck((field) => field.isTouched, "some");
export const isFormValid = walkAndCheck((field) => !field.error, "every", true);
export const isFormTouchedAndValid = walkAndCheck(
  (field) => field.isTouched && !field.error,
  "some",
);
export const isFormEmpty = walkAndCheck((field) => !field.value, "every");

export const formTouchAll = (form: Form) => {
  Object.values(form).forEach((value) => {
    if (value instanceof TextField) {
      value.touch();
    }
    if (Array.isArray(value)) {
      value.forEach((item) => formTouchAll(item));
    }
    return false;
  });
};
