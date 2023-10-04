import { TextField } from "./mobx-form.ts";

type Form = Record<string, unknown>;

const isFieldTouchedAndHasError = (field: TextField<unknown>) =>
  field.isTouched && !!field.error;

const isArrayTouchedAndHasError = (arr: TextField<unknown>[]) => {
  return arr.some(isFieldTouchedAndHasError);
};

const isFormTouchedAndHasError = (form: Form) => {
  return Object.values(form).some((value) => {
    if (value instanceof TextField) {
      return isFieldTouchedAndHasError(value);
    }
    if (Array.isArray(value)) {
      return isArrayTouchedAndHasError(value);
    }
    return false;
  });
};

export const formTouchAll = (form: Form) => {
  Object.values(form).some((value) => {
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
