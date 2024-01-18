import { TextField } from "./text-field.ts";
import { BooleanField } from "./boolean-field.ts";

import { ListField } from "./list-field.ts";
import { isTouchableField } from "./touchable-field.ts";

type Form = Record<string, unknown>;

const walkAndCheck = (
  check: (
    field: TextField<unknown> | BooleanField | ListField<unknown>,
  ) => boolean,
  iterateArray: "some" | "every",
  defaultValue = false,
) => {
  return (form: Form) => {
    return Object.values(form)[iterateArray]((value) => {
      if (value instanceof TextField || value instanceof BooleanField) {
        return check(value);
      }
      if (value instanceof ListField) {
        const listFieldChecked = check(value);
        const listItemsChecked = value.value[iterateArray](
          walkAndCheck(check, iterateArray, defaultValue),
        );
        return [listItemsChecked, listFieldChecked][iterateArray](Boolean);
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

export const walkAndDo = (fn: (field: unknown) => void) => (form: Form) => {
  fn(form);

  const isObject = typeof form === "object" && form !== null;
  if (!isObject) {
    return;
  }

  Object.values(form).forEach((value) => {
    fn(value);
    if (Array.isArray(value)) {
      value.forEach(walkAndDo(fn));
    }
    if (value instanceof ListField) {
      value.value.forEach(walkAndDo(fn));
    }
    if (typeof value === "object" && value !== null) {
      Object.values(value).forEach(walkAndDo(fn));
    }
  });
};

export const formTouchAll = walkAndDo((field: unknown) => {
  if (isTouchableField(field)) {
    field.touch();
  }
});

export const formUnTouchAll = walkAndDo((field: unknown) => {
  if (isTouchableField(field)) {
    field.unTouch();
  }
});
