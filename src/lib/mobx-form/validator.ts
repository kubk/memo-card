// @ts-nocheck

// https://codesandbox.io/s/github/final-form/react-final-form/tree/master/examples/field-level-validation?file=/index.js
export const validators = {
  required:
    (errorMessage) =>
    (value) =>
      value ? undefined : errorMessage,
  all:
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined,
      ),
};
