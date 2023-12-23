// @ts-nocheck
import { t } from "../../translations/t.ts";

// https://codesandbox.io/s/github/final-form/react-final-form/tree/master/examples/field-level-validation?file=/index.js
export const validators = {
  required:
    (errorMessage = t("validation_required")) =>
    (value) =>
      value ? undefined : errorMessage,
  number: (value) => (isNaN(value) ? t("validation_number") : undefined),
  all:
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined,
      ),
};
