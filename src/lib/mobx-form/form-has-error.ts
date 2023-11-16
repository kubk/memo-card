import { BooleanField, TextField } from "./mobx-form.ts";

type Form = Record<string, unknown>;

const walkAndCheck = (
  check: (field: TextField<unknown> | BooleanField) => boolean,
  iterateArray: "some" | "every",
) => {
  return (form: Form) => {
    return Object.values(form)[iterateArray]((value) => {
      if (value instanceof TextField || value instanceof BooleanField) {
        return check(value);
      }
      if (Array.isArray(value)) {
        return value[iterateArray](check);
      }
      return false;
    });
  };
};

export const isFormTouchedAndHasError = walkAndCheck(
  (field) => field.isTouched && !!field.error,
  "some",
);

export const isFormTouched = walkAndCheck((field) => field.isTouched, "some");
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

export const isFormValid = (form: Form) => !isFormTouchedAndHasError(form);
